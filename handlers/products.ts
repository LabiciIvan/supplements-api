import { Request, Response, NextFunction }    from 'express';
import Products                               from '../controllers/products';
import whoIsUser                              from '../middlewares/whoIsUser';
import { hasArrayData }                       from '../services/functions';
import {
  createProductInterface,
  updateProduct,
  whoIsUserInterface
}                                             from '../types';

// Products controller which interacts with the database.
const productController = new Products();


const getProductsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { category } = req.params;

  if (!Products.categories.includes(category)) {
    res.status(400).json({
      message: 'Invalid category.',
    });
    return;
  }

  try {
    const products = await productController.getAllProductsFromCategory(category);

    res.status(200).json(products);
  } catch (error: any) {
    console.log('Error in /handlers/products/getProductsHandler():', error);
    // MySQL or Server error
    res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}


const getProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;

  try {
    const product = await productController.getProductById(parseInt(productId));

    if (!product.length) {
      res.status(404).json({
        message: 'Product not found.',
      });
      return;
    }

    res.status(200).json(product);

  } catch (error: any) {
    console.log('Error in /handlers/products/getProductHandler():', error);
    res.status(500).json({
      message: error?.message || 'Internal server error',
    })
  }
}


const getDeletedProductsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productController.getDeletedProducts();

    if (!hasArrayData(product)) {
      res.status(404).json({
        message: 'There are no deleted product.',
      });
      return;
    }

    res.status(200).json(product);

  } catch (error: any) {
    console.log('Error in /handlers/products/getProductHandler():', error);
    res.status(500).json({
      message: error?.message || 'Internal server error',
    })
  }
}


const createProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const token = (req as any).bearerToken;

    const userData: boolean | whoIsUserInterface = await whoIsUser(token);

    if (typeof userData === 'boolean') {
        res.status(404).json({
        message: 'Unauthorized user'
      });
      return;
    }


    if (userData.userID !== req.body.createdBy) {
        res.status(422).json({
        message: "Product 'createdBy' ID doesn't match the User ID making the request"
      });
      return;
    }

    const product: createProductInterface = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      category: req.body.category,
      createdBy: userData['userID']
    }

    const result = await productController.createProduct(product);

    res.status(201).json(result);
    return;

  } catch (error: any) {
    console.log('Error in /handler/products.ts/createProductHandle(): ', error);
    res.status(500).json({
      message: 'Internal system error'
    });
  }
}


const updateProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { productId } = req.params;

    const {name, description, price, quantity} = req.body;

    const product = await productController.getProductById(parseInt(productId));

    if (!hasArrayData(product)) {
      res.status(404).json({
        message: 'Product not found.',
      });
      return;
    }

    const updateResult: updateProduct = await productController.updateProduct(parseInt(productId), name, description, parseFloat(price), parseInt(quantity));

    res.status(200).json(updateResult);
  } catch (error: any) {
    console.log('Error in /handler/products.ts/createProductHandle(): ', error);
    res.status(500).json({
      message: 'Internal system error'
    });
  }
}


const softDeleteProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    // action - is an optional parameter in the URL, and if not present proceed to delete it.
    const { productId , action } = req.params;

    // Decide what product we want to get based on the action, if action is present and it's a
    // 'restore' then we assume it's a deleted product, otherwise is a product which is not deleted.
    const product = await productController.getProductById(parseInt(productId), ((action && action === 'restore') ? 1 : 0));

    if (!product.length) {
      res.status(404).json({
        message: `Product not found, as it might ${action && action === 'restore' ? 'not' : ''} be deleted.`,
      });
      return;
    }

    const deleteResult: updateProduct = await productController.softDeleteProduct(parseInt(productId), (action && action === 'restore') ? 0 : 1);

    res.status(200).json(deleteResult);
  } catch (error: any) {
    console.log('Error in /handler/products.ts/softDeleteProductHandler(): ', error);
    res.status(500).json({
      message: 'Internal system error'
    });
  }
}

export {
  getProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  softDeleteProductHandler,
  getDeletedProductsHandler
}
