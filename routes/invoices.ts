import express, { RequestHandler }        from 'express';
import {
  getInvoiceHandler,
  getAllInvoicesHandler,
}                                         from '../handlers/invoices';
import { validateGetInvoice }             from '../validations/invoice';
import attachToken                        from '../middlewares/attachToken';
import isTokenValid                       from '../middlewares/isTokenValid';
import isAdmin                            from '../middlewares/isAdmin';


const invoices = express.Router();


invoices.get('/:invoiceId',
  validateGetInvoice as RequestHandler,
  getInvoiceHandler
);


invoices.get('/',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  getAllInvoicesHandler
);


export default invoices;