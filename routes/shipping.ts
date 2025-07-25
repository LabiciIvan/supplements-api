import express, { RequestHandler }          from 'express';
import {
  getShippingHandler,
  updateShippingHandler,
  deleteShippingHandler,
  createShippingHandler
}                                           from '../handlers/shipping';
import {
  validateGetShipping,
  validateDeleteShipping,
  validateCreateShipping,
  validateUpdateShipping
}                                           from '../validations/shipping';
import isAdmin                              from '../middlewares/isAdmin';
import attachToken                          from '../middlewares/attachToken';
import isTokenValid                         from '../middlewares/isTokenValid';
import requireToken                         from '../middlewares/requireToken';


const shipping = express.Router();


shipping.get('/get',
  validateGetShipping           as RequestHandler,
  getShippingHandler
);


shipping.post('/create',
  attachToken                   as RequestHandler,
  requireToken                  as RequestHandler,
  isTokenValid                  as RequestHandler,
  isAdmin                       as RequestHandler,
  validateCreateShipping        as RequestHandler,
  createShippingHandler
);


shipping.put('/update/:shippingName',
  attachToken                   as RequestHandler,
  requireToken                  as RequestHandler,
  isTokenValid                  as RequestHandler,
  isAdmin                       as RequestHandler,
  validateUpdateShipping        as RequestHandler,
  updateShippingHandler
);


shipping.delete('/delete/:shippingName',
  attachToken                   as RequestHandler,
  requireToken                  as RequestHandler,
  isTokenValid                  as RequestHandler,
  isAdmin                       as RequestHandler,
  validateDeleteShipping        as RequestHandler,
  deleteShippingHandler
);


export default shipping;