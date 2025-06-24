import { body, param, validationResult }      from 'express-validator';
import { Request, Response, NextFunction }    from 'express';


const validateGetInvoice = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('invoiceId')
    .isNumeric()
    .withMessage("The 'invoiceId' parameter must be a numeric value.")
    .run(req)
  ]);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      messsage: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
}

export {
  validateGetInvoice
}