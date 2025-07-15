import {
  orderDataInterface,
  orderDataFiltered,
  orderDetailInterface,
  detailsFiltered,
  orderProductInterface,
  orderStatusInterface,
  orderStatusType,
  productInterface,
  shippingInterface,
  BaseResponse,
  DataResponse
}                         from '../types';
import {
  FieldPacket
}                         from 'mysql2/promise';
import {
  hasArrayData
}                         from '../services/functions';
import BaseController     from '../core/baseController';


/**
 * Orders class.
 *
 * This class handles users orders.
 *
 * It interacts with the database to assist in the order process.
 */
class Orders extends BaseController {

  constructor() {
    super();
  }

  /**
   * Process next order allowed status.
   *
   * Validates if an order can transition from its current status to a new status.
   *
   * Status Transition Rules (Tree View):
   *
   * - pending:
   *   → confirmed.
   *   → cancelled.
   *
   * - confirmed:
   *   → shipped.
   *   → cancelled.
   *
   * - shipped:
   *   → delivered.
   *   → cancelled.
   * 
   * - delivered (final state - no further transitions allowed).
   *
   * - cancelled (final state - no further transitions allowed).
   *
   * Rules:
   * 1. Cannot transition to the same status.
   * 2. Can always transition to 'cancelled' from any non-final state.
   * 3. Transitions must follow the hierarchy: pending → confirmed → shipped → delivered.
   *
   * pending
   * ├── confirmed
   * │   ├── shipped
   * │   │   ├── delivered (END)
   * │   │   └── cancelled (END)
   * │   └── cancelled (END)
   * └── cancelled (END)
   */
  public async nextStatus(orderId: number): Promise<orderStatusType[] | BaseResponse> {
    try {

      const fetchedData: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          o.previous_status,
          os.status
          FROM orders AS o
          INNER JOIN order_status AS os ON o.status_id = os.id
          WHERE o.id = ?
        `,
        [orderId]
      );

      if (!hasArrayData(fetchedData[0])) {
        return {
          status: this.fail,
          message: 'Could not find order.'
        }
      }

      const {status} = fetchedData[0][0];

      if (status === 'delivered' || status === 'cancelled' ) {
        return {
          status: this.fail,
          message: 'Final order status reached.'
        }
      }

      if (status === 'pending') {
        return ['confirmed', 'cancelled'];
      }

      if (status === 'confirmed') {
        return ['shipped', 'cancelled'];
      }

      // This stage of code execution status is only 'shipped'.
      return ['delivered', 'cancelled'];

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/nextStatus(): ', error);
      throw new Error(error.message);
    }
  }


  public async canPlaceOrderInThisCountry(country: string): Promise<DataResponse<{id: number, vat: string, currency: string, currency_symbol: string}> | BaseResponse> {
    try {

      const [countryVAT]: [any, FieldPacket[]] = await this.db.query(
        `SELECT id, vat, currency, currency_symbol FROM countries_vat WHERE country LIKE ?`,
        [`%${country}%`]
      );

      if (!hasArrayData(countryVAT)) {
        return {
          status: this.fail,
          message: `Can\'t place order as we don\'t merchandise to ${country}`,
        }
      }

      return {
        status: this.success,
        message: 'Countries VAT fetched successfully.',
        data: {
          id: countryVAT[0].id,
          vat: countryVAT[0].vat,
          currency: countryVAT[0].currency,
          currency_symbol: countryVAT[0].currency_symbol
        }
      };

    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getOrderStatuses(): Promise<orderStatusInterface | BaseResponse> {
    try {

      const fetchedData: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, status FROM order_status WHERE status = ?',
        [status]
      );

      if (!hasArrayData(fetchedData)) {
        return {
          status: this.fail,
          message: `Status ${status} not found.`
        }
      }

      return {
        id: fetchedData[0][0].id,
        status: fetchedData[0][0].status,
      }

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/getStatusId(): ', error);
      throw new Error(error.message);
    }
  }


  private async getStatusId(status: orderStatusType): Promise<orderStatusInterface | BaseResponse> {
    try {

      const fetchedData: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, status FROM order_status WHERE status = ?',
        [status]
      );

      if (!hasArrayData(fetchedData)) {
        return {
          status: this.fail,
          message: `Status ${status} not found.`
        }
      }

      return {
        id: fetchedData[0][0].id,
        status: fetchedData[0][0].status,
      }

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/getStatusId(): ', error);
      throw new Error(error.message);
    }
  }


  public calculateTotalOrder(products: productInterface[]): number {
    return products.reduce((sum, product) => sum + ((product.price * product.quantity) + parseFloat(product.vat_applied)), 0);
  }


  public async createOrder(products: productInterface[], shipping: shippingInterface, user_id: number | null , countryVatID: number, total: number): Promise<DataResponse<{id: number}>> {
    try {
      // New orders will always have a pending status.
      const pendingStatusId = await this.getStatusId('pending');

      if ('message' in pendingStatusId) {
        throw new Error(`Can't find pending status in order_status table`);
      }

      // Destructure shipping object.
      const {address, city, country, postalCode, shippingMethod, shippingCost, userEmail} = shipping;

      // Register order shipping.
      const [shippingInsert]: [any, FieldPacket[]] = await this.db.query(
        'INSERT INTO shipping (address, city, country, postal_code, shipping_method, shipping_cost) VALUES (?, ?, ?, ?, ?, ?)',
        [address, city, country, postalCode, shippingMethod, shippingCost]
      );

      // Place order with status of pending.
      const orderInsert: [any, FieldPacket[]] = await this.db.query(
        'INSERT INTO orders (total, user_id, user_email, status_id, shipping_id, country_vat_id) VALUES (?, ?, ?, ?, ?, ?)',
        [total, user_id, userEmail, pendingStatusId.id, shippingInsert.insertId, countryVatID]
      );

      const orderId = orderInsert[0].insertId;

      // Register orders_products
      products.forEach(async product => {
        await this.db.query(
          'INSERT INTO orders_products (quantity, base_price, vat_applied, vat_value, total_price, order_id, product_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [product.quantity, product.price, product.vat_applied, product.vat_value, product.total_price, orderId, product.id]
        );
      });

      return {
        status: this.success,
        message: 'Order placed successfully.',
        data: {
          id: orderId,
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/createOrder(): ', error);
      throw new Error(error.message);
    }
  }


  /**
   * Get the placed order details.
   *
   * Returns the following details:
   * - products.id                    - custom name product_id meaning the id of the product.
   * - products.name                  - product name placed in the order.
   * - orders_products.quantity       - quantity of the products in the order.
   * - orders_products.base_price     - price of the products in the order.
   * - product_total                  - custom multiplication between [ orders_products.quantity *
   *                                    orders_products.base_price ].
   * - order_status.order_total       - order total amount without the shipping cost.
   * - shipping.address               - shipping address, usually the street including the number.
   * - shipping.city                  - shipping city.
   * - shipping.country               - shipping country.
   * - shipping.postal_code           - shipping postal code, sometimes might be null.
   * - shipping.shipping_method       - shipping method delivery.
   * - shipping.shipping_cost         - shipping cost applied, different for each shipping method.
   * - countries_vat.vat              - country VAT percentage which applies for each product.
   * - countries_vat.year             - country VAT from respective year.
   * - countries_vat.currency         - country currency.
   * - countries_vat.currency_symbol  - country currency symbol.
   * - total_with_shipping            - order total amount with shipping amount included.
   * - order_status.status            - order status under custom name AS order_status.
   * - users.username                 - is fetched under 'customer_name' but if no logged user did
   *                                    the order then will be fetched with a value of 'Guest'.
   * - users.email                    - is fetched under 'customer_email' but if no logged user did
   *                                    the order then will be fetched with a value of 'Guest'.
   *
   * @param orderId - the order id number, generated in the orders table when order was placed.
   *
   * @returns the order details or a message indicating that the order could not be found.
   */
  public async getOrder(orderId: number): Promise<BaseResponse | orderDataInterface> {
    try {
      const ordersFetched: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          p.id AS product_id,
          p.name,
          op.quantity,
          op.base_price,
          op.vat_applied,
          op.vat_value,
          op.total_price,
          o.total AS order_total,
          sp.address,
          sp.city,
          sp.country,
          sp.postal_code,
          sp.shipping_method,
          sp.shipping_cost,
          cv.vat,
          cv.year AS vat_year_applied,
          cv.currency AS currency,
          cv.currency_symbol AS currencySymbol,
          (o.total + sp.shipping_cost) AS total_with_shipping,
          os.status AS order_status,
          COALESCE(u.username, 'Guest') AS customer_name,
          COALESCE(u.email, 'Guest') AS customer_email
        FROM orders_products AS op
        INNER JOIN products AS p ON op.product_id = p.id
        INNER JOIN orders AS o ON op.order_id = o.id
        INNER JOIN shipping AS sp ON o.shipping_id = sp.id
        INNER JOIN order_status AS os ON o.status_id = os.id
        INNER JOIN countries_vat AS cv ON o.country_vat_id = cv.id
        LEFT JOIN users AS u ON u.id = o.user_id
        WHERE op.order_id = ?`,
        [orderId]
      );

      if (!hasArrayData(ordersFetched[0])) {
        return {
          status: this.fail,
          message: `Order ${orderId} not found.`
        }
      }

      const productsOrderDetails: orderProductInterface[] = ordersFetched[0].map((data:any )=> {
        return {
          product_id: data.product_id,
          name: data.name,
          quantity: parseInt(data.quantity),
          base_price: parseFloat(data.base_price),
          vat_applied: parseFloat(data.vat_applied),
          vat_value: parseFloat(data.vat_value),
          total_price: parseFloat(data.total_price),
        }
      });

      const orderDetails: orderDetailInterface = {
        address: ordersFetched[0][0].address,
        city: ordersFetched[0][0].city,
        country: ordersFetched[0][0].country,
        postal_code: ordersFetched[0][0].postal_code,
        shipping_method: ordersFetched[0][0].shipping_method,
        shipping_cost: parseFloat(ordersFetched[0][0].shipping_cost),
        order_total: parseFloat(ordersFetched[0][0].order_total),
        total_with_shipping: parseFloat(ordersFetched[0][0].total_with_shipping),
        order_status: ordersFetched[0][0].order_status,
        customer_name: ordersFetched[0][0].customer_name,
        customer_email: ordersFetched[0][0].customer_email,
        vat: ordersFetched[0][0].vat,
        vatYearApplied: ordersFetched[0][0].vat_year_applied,
        currency: ordersFetched[0][0].currency,
        currencySymbol: ordersFetched[0][0].currencySymbol,
      }

      return {
        status: this.success,
        details: orderDetails,
        products: productsOrderDetails,
      }

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/getOrder(): ', error);
      throw new Error(error.message);
    }
  }

  /**
   * Updates order status.
   *
   * Updates an order's status while preserving the previous status, moving the current status
   * from order_status.status to orders.previous_status.
   *
   * This ensures status history is maintained while keeping both tables synchronized.
   *
   * Status Transition Rules:
   * - pending → confirmed | cancelled
   * - confirmed → shipped | cancelled
   * - shipped → delivered | cancelled
   * - delivered → (no further changes allowed)
   *
   * @param orderId - order id number.
   * @param status - future order status.
   */
  public async updateOrderStatus(orderId: number, status: orderStatusType): Promise<DataResponse<{id: number}>> {
    try {

      await this.db.query(
        `UPDATE orders AS o
        INNER JOIN order_status AS os ON o.status_id = os.id
        SET o.previous_status = os.status, o.status_id = (SELECT id FROM order_status WHERE status = ?)
        WHERE o.id = ?
        `,
        [status, orderId]
      );

      return {
        status: this.success,
        message: 'Order status updated successfully.',
        data: {
          id: orderId,
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/updateOrderStatus(): ', error);
      throw new Error(error.message);
    }
  }


  public async getOrderByFilters(
    orderId?: string,
    status?: string,
    date?: string,
    year?: string,
    month?: string,
    day?: string,
    shipping?: string,
    city?: string,
    country?: string
  ): Promise< BaseResponse | DataResponse<{details: any[], products: any[]}[]> > {
    try {
      // Build dynamic SQL where clauses or filter logic
      const filters: string[] = [];
      const values: any[] = [];

      if (orderId) {
        filters.push(`o.id = ?`);
        values.push(orderId);
      }

      if (status) {
        filters.push(`os.status = ?`);
        values.push(status);
      }

      if (date) {
        filters.push(`o.created_at >= ? AND o.created_at < ?`);

        const startDate = `${date} 00:00:00`;

        const nextDate = new Date(date);

        nextDate.setDate(nextDate.getDate() + 1);

        const endDate = `${nextDate.toISOString().split('T')[0]} 00:00:00`;

        values.push(startDate, endDate);
      }

      if (year) {
        filters.push(`YEAR(o.created_at) = ?`);
        values.push(year);
      }

      if (month) {
        filters.push(`MONTH(o.created_at) = ?`);
        values.push(month);
      }

      if (day) {
        filters.push(`DAY(o.created_at) = ?`);
        values.push(day);
      }

      if (shipping) {
        filters.push(`sp.shipping_method = ?`);
        values.push(shipping);
      }

      if (city) {
        filters.push(`sp.city = ?`);
        values.push(city);
      }

      if (country) {
        filters.push(`sp.country = ?`);
        values.push(country);
      }

      const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

      const ordersFetched: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          p.id AS product_id,
          p.name,
          op.quantity,
          op.base_price,
          op.vat_applied,
          op.vat_value,
          op.total_price,
          o.total AS order_total,
          o.id AS order_id,
          o.created_at AS order_date,
          sp.address,
          sp.city,
          sp.country,
          sp.postal_code,
          sp.shipping_method,
          sp.shipping_cost,
          cv.vat,
          cv.year AS vat_year_applied,
          cv.currency AS currency,
          cv.currency_symbol AS currencySymbol,
          (o.total + sp.shipping_cost) AS total_with_shipping,
          os.status AS order_status,
          COALESCE(u.username, 'Guest') AS customer_name,
          COALESCE(u.email, 'Guest') AS customer_email
        FROM orders_products AS op
        INNER JOIN products AS p ON op.product_id = p.id
        INNER JOIN orders AS o ON op.order_id = o.id
        INNER JOIN shipping AS sp ON o.shipping_id = sp.id
        INNER JOIN order_status AS os ON o.status_id = os.id
        INNER JOIN countries_vat AS cv ON o.country_vat_id = cv.id
        LEFT JOIN users AS u ON u.id = o.user_id
        ${whereClause}`,
        values
      );

      if (!hasArrayData(ordersFetched[0])) {
        return {
          status: this.fail,
          message: `Filtered order not found.`
        }
      }

      const fetchedOrders: any[] = ordersFetched[0];

      if (!fetchedOrders.length) {
        return {
          status: this.fail,
          message: `Filtered order not found.`
        };
      }

      // A map to group products by order_id
      const ordersMap = new Map<number, { details: any, products: any[] }>();

      for (const row of fetchedOrders) {
        const orderId = parseInt(row.order_id);

        // If this order hasn't been added to the map yet
        if (!ordersMap.has(orderId)) {
          ordersMap.set(orderId, {
            details: {
              order_id:             row.order_id,
              order_date:           row.order_date,
              address:              row.address,
              city:                 row.city,
              country:              row.country,
              postal_code:          row.postal_code,
              shipping_method:      row.shipping_method,
              shipping_cost:        parseFloat(row.shipping_cost),
              order_total:          parseFloat(row.order_total),
              total_with_shipping:  parseFloat(row.total_with_shipping),
              order_status:         row.order_status,
              customer_name:        row.customer_name,
              customer_email:       row.customer_email,
              vat:                  row.vat,
              vatYearApplied:       row.vat_year_applied,
              currency:             row.currency,
              currencySymbol:       row.currencySymbol,
            },
            products: []
          });
        }

        // Push the product for the order
        ordersMap.get(orderId)!.products.push({
          product_id:   row.product_id,
          name:         row.name,
          quantity:     parseInt(row.quantity),
          base_price:   parseFloat(row.base_price),
          vat_applied:  parseFloat(row.vat_applied),
          vat_value:    parseFloat(row.vat_value),
          total_price:  parseFloat(row.total_price)
        });
      }

      // Convert Map values to array
      const finalFilteredOrders = Array.from(ordersMap.values());

      return {
        message: 'Order fetched successfully',
        status: this.success,
        data: finalFilteredOrders
      };

    } catch (error: any) {
      console.log('Error in /controllers/orders.ts/getOrderByFilters(): ', error);
      throw new Error(error.message);
    }
  }

}


export default Orders;

