import { body, param, query, validationResult }           from 'express-validator'
import { Request, Response, NextFunction }                from 'express';

const validatePlaceOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {

  await Promise.all([
    body('products')
      .isArray({ min: 1 })
      .withMessage("Products must be a non-empty array")
      .run(req),

    body('products.*.id')
      .isInt().withMessage("Each product ID must be an integer")
      .run(req),

    body('products.*.price')
      .isDecimal().withMessage("Each product price must be a decimal string")
      .run(req),

    body('products.*.quantity')
      .isInt({ min: 1 }).withMessage("Each product quantity must be an integer greater than 0")
      .run(req),

    body('shipping.userEmail')
      .notEmpty().withMessage("Shipping userEmail is required")
      .isEmail().withMessage("Shipping userEmail is not a valid email")
      .run(req),

    body('shipping.address')
      .isString().notEmpty().withMessage("Shipping address is required")
      .run(req),

    body('shipping.city')
      .isString().notEmpty().withMessage("Shipping city is required")
      .run(req),

    body('shipping.country')
      .isString().notEmpty().withMessage("Shipping country is required")
      .run(req),

    body('shipping.postalCode')
      .isString().notEmpty().withMessage("Shipping postal code is required")
      .run(req),

    body('shipping.shippingMethod')
      .isString().notEmpty().withMessage("Shipping method is required")
      .run(req),

    body('shipping.shippingCost')
      .isNumeric().withMessage("Shipping cost must be a number")
      .run(req),
  ]);

  // Extract errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}


const validateGetOrderHandler =  (req: Request, res: Response, next: NextFunction): Response | void => {
  param('orderId')
    .isInt().withMessage("The 'orderId' parameter must be a numeric value.")
    .run(req);

  const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}


const validateFilterOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    query('orderId')
      .optional()
      .isInt()
      .withMessage("The 'orderId' parameter must be a numeric value.")
      .run(req),
    query('status')
      .optional()
      .matches(/^(pending|confirmed|shipped|delivered|cancelled)$/)
      .withMessage("The 'status' parameter can be one of the following: pending|confirmed|shipped|delivered|cancelled.")
      .run(req),
    query('date')
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("The 'date' parameter must be in the format YYYY-MM-DD.")
      .run(req),
    query('year')
      .optional()
      .isNumeric()
      .withMessage("The 'year' parameter must be a numeric value.")
      .run(req),
    query('month')
      .optional()
      .isNumeric()
      .withMessage("The 'month' parameter must be a numeric value.")
      .run(req),
    query('day')
      .optional()
      .isNumeric()
      .withMessage("The 'day' parameter must be a numeric value.")
      .run(req),
    query('shipping')
      .optional()
      .isString()
      .withMessage("The 'shipping' parameter must be a string value.")
      .run(req),
    query('city')
      .optional()
      .isString()
      .withMessage("The 'orderId' parameter must be a string value.")
      .run(req),
    query('country')
      .optional()
      .isString()
      .withMessage("The 'orderId' parameter must be a string value.")
      .run(req),
  ]);

  const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}


const validateUpdateOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('orderId')
      .isInt().withMessage("The 'orderId' parameter must be a numeric value.")
      .run(req),

    param('status')
      .matches(/^(pending|confirmed|shipped|delivered|cancelled)$/)
      .withMessage('Param status is required, and can be one of the following: pending|confirmed|shipped|delivered|cancelled.')
      .run(req)
  ]);


  const errors = validationResult(req);

  console.log('validateUpdateOrderHandler error', errors);

    if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}


export {
  validatePlaceOrderHandler,
  validateGetOrderHandler,
  validateFilterOrdersHandler,
  validateUpdateOrderHandler
}