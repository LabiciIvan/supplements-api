import express, { RequestHandler }  from 'express';
import attachToken                  from '../middlewares/attachToken';
import {
  filterOrdersHandler,
  getOrderHandler,
  placeOrderHandler,
  updateOrderHandler,
  getAvailableOrderStatuses
}                                   from '../handlers/orders';
import isTokenValid                 from '../middlewares/isTokenValid';
import restricViewOrder             from '../middlewares/restricViewOrder';
import isAdmin                      from '../middlewares/isAdmin';
import {
  validatePlaceOrderHandler,
  validateGetOrderHandler,
  validateFilterOrdersHandler,
  validateUpdateOrderHandler
}                                   from '../validations/orders';


const orders = express.Router();

// Get order details - Only the user who made the order or a user with a role of admin.
orders.get('/:orderId',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  restricViewOrder                  as RequestHandler,
  validateGetOrderHandler           as RequestHandler,
  getOrderHandler
);

orders.get('/statuses/get',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  restricViewOrder                  as RequestHandler,
  validateGetOrderHandler           as RequestHandler,
  getAvailableOrderStatuses
);

// Get orders by filtering details - Only admins.
orders.get('/',
  attachToken                       as RequestHandler,
  // isTokenValid                      as RequestHandler,
  // isAdmin                           as RequestHandler,
  validateFilterOrdersHandler       as RequestHandler,
  filterOrdersHandler
);

// Place an order, it can be an autheticated user or a guest user.
orders.post('/',
  attachToken                       as RequestHandler,
  validatePlaceOrderHandler         as RequestHandler,
  placeOrderHandler
);

// Update an order status
orders.put('/:orderId/:status',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validateUpdateOrderHandler        as RequestHandler,
  updateOrderHandler
);


export default orders;