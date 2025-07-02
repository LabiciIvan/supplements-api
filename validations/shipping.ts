import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction }    from 'express';


const validateGetShipping = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  next();
}


const validateDeleteShipping = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
    param('shippingName')
      .isString()
      .withMessage("The 'shippingId' parameter must be a numeric value.")
      .run(req),
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


const validateCreateShipping = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
    body('name')
      .isString()
      .notEmpty()
      .withMessage("Shipping method 'name' is required.")
      .isLength({ max: 100 })
      .withMessage("Shipping method 'name' must not exceed 100 characters.")
      .run(req),

    body('price')
      .isFloat({ min: 0 })
      .withMessage("Shipping method 'price' must be a number greater than or equal to 0.")
      .notEmpty()
      .withMessage("Shipping method 'price' is required.")
      .run(req),
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


const validateUpdateShipping = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('shippingName')
      .isString()
      .withMessage("The 'shippingId' parameter must be a numeric value.")
      .run(req),

    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Shipping method 'name' must be a non-empty string.")
      .isLength({ max: 100 })
      .withMessage("Shipping method 'name' must not exceed 100 characters.")
      .run(req),

    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Shipping method 'price' must be a number greater than or equal to 0.")
      .notEmpty()
      .withMessage("Shipping method 'price' cannot be empty.")
      .run(req),

    body()
      .custom(body => {
        const { name, price } = body;

        if (name === undefined && price === undefined) {
          throw new Error("At least one field ('name' or 'price') must be provided to update the shipping method.");
        }

        return true;
      })
      .run(req),
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
  validateGetShipping,
  validateDeleteShipping,
  validateCreateShipping,
  validateUpdateShipping
}