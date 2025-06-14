import express, { RequestHandler }  from 'express';
import requireToken                 from '../middlewares/requireToken';
import isTokenValid                 from '../middlewares/isTokenValid';
import isAdmin                      from '../middlewares/isAdmin';
import attachToken                  from '../middlewares/attachToken';

import {
  createProductHandler,
  getProductsHandler,
  getProductHandler,
  updateProductHandler,
  softDeleteProductHandler,
  getDeletedProductsHandler
}                                   from '../handlers/products';
import {
  validateGetProducts,
  validateGetDeletedProducts,
  validateGetProduct,
  validateCreateProduct,
  validateSoftDeleteProduct,
  validateUpdateProduct
}                                   from '../validations/products';


const products = express.Router();


// All deleted products
products.get('/deleted',
  attachToken                 as RequestHandler,
  requireToken                as RequestHandler,
  isTokenValid                as RequestHandler,
  isAdmin                     as RequestHandler,
  validateGetDeletedProducts  as RequestHandler,
  getDeletedProductsHandler
);


// All products from category
products.get('/:category',
  // attachToken                 as RequestHandler,
  // requireToken                as RequestHandler,
  // isTokenValid                as RequestHandler,
  validateGetProducts         as RequestHandler,
  getProductsHandler
);


// One product by ID
products.get('/item/:productId',
  validateGetProduct          as RequestHandler,
  getProductHandler
);


// Create new product
products.post('/:category',
  attachToken                 as RequestHandler,
  requireToken                as RequestHandler,
  isTokenValid                as RequestHandler,
  isAdmin                     as RequestHandler,
  validateCreateProduct       as RequestHandler,
  createProductHandler
);


// Delete product - this is a soft delete and it can be used to restore the deleted product.
products.delete('/item/:productId/:action?',
  attachToken                 as RequestHandler,
  requireToken                as RequestHandler,
  isTokenValid                as RequestHandler,
  isAdmin                     as RequestHandler,
  validateSoftDeleteProduct   as RequestHandler,
  softDeleteProductHandler
);


// Update product
products.put('/item/:productId',
  attachToken                 as RequestHandler,
  requireToken                as RequestHandler,
  isTokenValid                as RequestHandler,
  isAdmin                     as RequestHandler,
  validateUpdateProduct       as RequestHandler,
  updateProductHandler
);


export default products;