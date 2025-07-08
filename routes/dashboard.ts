import express, { RequestHandler }  from 'express';

import {
  getMostOrderedProducts,
  getTotalRevenue,
  getRevenueAndPercentageDifference
}                                   from '../handlers/dashboard';
import {
  validateGetMostOrdererProducts,
  validateGetTotalRevenue,
  validateGetRevenueAndPercentageDifference
}                                  from '../validations/dashboard';
import attachToken                  from '../middlewares/attachToken';
import requireToken                 from '../middlewares/requireToken';
import isTokenValid                 from '../middlewares/isTokenValid';
import isAdmin                      from '../middlewares/isAdmin';


const dashboard = express.Router();


dashboard.get('/most-ordered-products/get',
  attachToken                     as RequestHandler,
  requireToken                    as RequestHandler,
  isTokenValid                    as RequestHandler,
  isAdmin                         as RequestHandler,
  validateGetMostOrdererProducts  as RequestHandler,
  getMostOrderedProducts
);


dashboard.get('/total-revenue/:year?/:month?/:day?/get',
  attachToken                     as RequestHandler,
  requireToken                    as RequestHandler,
  isTokenValid                    as RequestHandler,
  isAdmin                         as RequestHandler,
  validateGetTotalRevenue         as RequestHandler,
  getTotalRevenue
);


dashboard.get('/revenue-percentage-difference/get',
  attachToken                     as RequestHandler,
  requireToken                    as RequestHandler,
  isTokenValid                    as RequestHandler,
  isAdmin                         as RequestHandler,
  validateGetRevenueAndPercentageDifference         as RequestHandler,
  getRevenueAndPercentageDifference
);


export default dashboard;