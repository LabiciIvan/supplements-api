import { Request, Response, NextFunction }  from 'express';

import Orders                               from '../controllers/orders';
import Products                             from '../controllers/products';
import Invoice                              from '../controllers/invoice';
import shippingMethod                       from '../controllers/shippingMethod';
import {
  orderStatusType,
  productInterface,
  shippingInterface
}                                           from '../types';
import { decodeJwtToken, hasArrayData }     from '../services/functions';
import sendEmail                            from '../core/emailer';

const ordersController = new Orders();

const productController = new Products();

const invoiceController = new Invoice();

const shippingMethodController = new shippingMethod();


// Create a new order.
const placeOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const canPlaceOrder = await ordersController.canPlaceOrderInThisCountry(req.body.shipping.country);

    // For type safety we double check if data exists in result from canPlaceOrderInThisCountry() method.
    const countryVAT = 'data' in canPlaceOrder && canPlaceOrder.data;

    if ('status' in canPlaceOrder && canPlaceOrder.status === 'fail' || !countryVAT) {
      res.status(400).json(canPlaceOrder);
      return;
    }

    // Even guest users can place orders.
    const payload = (req as any).bearerToken ? await decodeJwtToken((req as any).bearerToken) : null;

    const shipping: shippingInterface = {
      address:         req.body.shipping.address,
      city:            req.body.shipping.city,
      country:         req.body.shipping.country,
      postalCode:      req.body.shipping.postalCode,
      shippingMethod:  req.body.shipping.shippingMethod,
      shippingCost:    req.body.shipping.shippingCost,
      userEmail:       req.body.shipping.userEmail
    };

    const shippingExists = await shippingMethodController.getShippingDetails(shipping.shippingMethod);

    // For type safety we double check if data exists in result from getShippingDetails() method.
    const shippingMethod = 'data' in shippingExists && shippingExists.data;

    if ('status' in shippingExists && shippingExists.status === 'fail' || !shippingMethod) {
      res.status(404).json(shippingExists);
      return;
    }

    // Update shipping cost using the shipping_methods data from the database, for safety reasons.
    shipping.shippingCost = shippingMethod.price;

    const user_id = (payload ? payload.userId as number : payload);

    let clientProducts: productInterface[] = req.body.products;

    const productIds: number[] = clientProducts.map(product => product.id);

    const products: productInterface[] = await productController.getProductsByMultipleId(productIds);

    // When order is placed the database products are checked for safety reasons, this way we make
    // sure the product prices are the ones from database as well.
    // we calculate the VAT and total price including vat.
    clientProducts = clientProducts.map(product => {

      const dbProduct = products.find(db => db.id === product.id);

      if (!dbProduct) {
        throw new Error(`Product with ID ${product.id} not found in database`);
      }

      if ((dbProduct.quantity - product.quantity) < 0) {
        throw new Error(`Can't place order as products id: ${product.id} quantity ${product.quantity} exceeds the stock quantity ${dbProduct.quantity}`);
      }

      const price       = Number(dbProduct.price);
      const vat         = Number(countryVAT.vat);

      const baseTotal   = product.quantity * price;
      const vatAmount   = (baseTotal * vat) / 100;
      const totalPrice  = baseTotal + vatAmount;

      return {
        id:           product.id,
        quantity:     product.quantity,
        price:        price,
        vat_applied:  vatAmount.toFixed(2),
        vat_value:    vat,
        total_price:  totalPrice.toFixed(2)
      };
    });

    const total: number = ordersController.calculateTotalOrder(clientProducts);

    await productController.updateProductsQuantity(clientProducts);

    const placedOrderDetails = await ordersController.createOrder(clientProducts, shipping, user_id, countryVAT.id, total);

    setTimeout(async () => {
      const invoiceDetails = await invoiceController.createInvoice(placedOrderDetails.data.id);

      const invoiceData = await invoiceController.getInvoice(invoiceDetails.data.id);

      // Send invoie email confirmation.
      sendEmail(shipping.userEmail, `Supplements - API Store - Invoice #${invoiceData.data.id}`, invoiceData.data.content);

    }, 5000);

    res.status(200).json(placedOrderDetails);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/placeOrderHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


const getOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {orderId} = req.params;

    const order = await ordersController.getOrder(parseInt(orderId));

    res.status(200).json(order);
  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/getOrderHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


/**
 * Update order status handler.
 * 
 * Updating the order status require to anticipate the next allowed status, as an order can't go
 * from a pending to shipped status, as it skipped confirmed step.
 * 
 * Uses the Order controller nextStatus() method to get the possible next available status.
 * 
 * We need to be aware of a cancelled status, as this must revert back the quantity of each product.
 */
const updateOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { orderId, status } = req.params as { orderId: string, status: orderStatusType };

    const nextAllowedStatus = await ordersController.nextStatus(parseInt(orderId));

    if ('message' in nextAllowedStatus) {
      res.status(401).json(nextAllowedStatus);
      return;
    }


    if (!nextAllowedStatus.includes(status)) {
      res.status(401).json({
        message: `Order status phase is not correct, allowed only: ${nextAllowedStatus}.`
      });
      return;
    }

    const updateResult = await ordersController.updateOrderStatus(parseInt(orderId), status);

    // Cancelled order must revert back the products quantity.
    if (status === 'cancelled') {
      const cancelledOrder = await ordersController.getOrder(parseInt(orderId));

      if ('message' in cancelledOrder) {
        res.status(401).json(cancelledOrder);
        return;
      }

      const productFromCancelledOrder: productInterface[] = cancelledOrder.products.map((product: any) => ({id: product.product_id, quantity: product.quantity, price: product.base_price, vat_applied: product.vat_applied, vat_value: product.vat_value, total_price: product.total_price}));

      // Restore the products quantity.
      await productController.updateProductsQuantity(productFromCancelledOrder, '+');
    }

    res.status(200).json(updateResult);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/updateOrderHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


const filterOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderId   = req.query.orderId?.toString();
    const status    = req.query.status?.toString();
    const year      = req.query.year?.toString();
    const month     = req.query.month?.toString();
    const day       = req.query.day?.toString();
    const shipping  = req.query.shipping?.toString();
    const city      = req.query.city?.toString();
    const country   = req.query.country?.toString();

    const filteredOrders = await ordersController.getOrderByFilters(orderId, status, year, month, day, shipping, city, country);

    res.status(200).json(filteredOrders);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/filterOrdersHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


export {
  placeOrderHandler,
  updateOrderHandler,
  getOrderHandler,
  filterOrdersHandler
}