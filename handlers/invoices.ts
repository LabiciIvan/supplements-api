import {
  Request,
  Response,
  NextFunction
}                 from 'express';
import Invoice    from '../controllers/invoice';


const invoiceController = new Invoice();


const getInvoiceHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoiceId = req.params.invoiceId;

    const invoiceData = await invoiceController.getInvoice(parseInt(invoiceId));

    if (!invoiceData) {
      res.status(404).json({
        message: 'Invoice not found.'
      });
      return;
    }

    res.status(200).send(invoiceData.data.content);

  } catch (error: any) {
    console.log('Error in /handlers/invoices.ts/getInvoiceHandler(): ', error);
    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}


const getAllInvoicesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const invoiceData = await invoiceController.getAllInvoices();

    if ('status' in invoiceData && invoiceData['status'] === 'fail') {
      res.status(404).json(invoiceData);
    }

    res.status(200).send(invoiceData);

  } catch (error: any) {
    console.log('Error in /handlers/invoices.ts/getAllInvoicesHandler(): ', error);
    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}

export {
  getInvoiceHandler,
  getAllInvoicesHandler
}