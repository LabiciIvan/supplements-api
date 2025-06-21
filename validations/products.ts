import { body, param, validationResult }      from 'express-validator';
import { Request, Response, NextFunction }    from 'express';


const validateGetProducts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('category')
    .isString()
    .withMessage("The 'category' parameter is required to fetch all products.")
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


const validateGetDeletedProducts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  // No validation required
  next();
}


const validateGetProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await param('productId')
          .isNumeric()
          .withMessage("The 'productId' parameter must be a numeric value.")
          .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      messsage: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
}


const validateCreateProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('category')
      .isString()
      .notEmpty()
      .withMessage("Product 'category' name is requied.")
      .run(req),
    body('name')
      .isString()
      .notEmpty()
      .withMessage("Product 'name' is required.")
      .run(req),
    body('price')
      .isNumeric()
      .notEmpty()
      .withMessage("Product 'price' must be numeric and is required.")
      .run(req),
    body('quantity')
      .isInt()
      .notEmpty()
      .withMessage("Product 'quantity' must be an integer and is required.")
      .run(req),
    body('category')
      .isInt()
      .notEmpty()
      .withMessage("Product 'category' must be an integer and is required.")
      .run(req),
    body('description')
      .isString()
      .notEmpty()
      .withMessage("Product 'description' is required.")
      .run(req),
    body('createdBy')
      .isInt()
      .notEmpty()
      .withMessage("Product 'createdBy' is required.")
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


const validateSoftDeleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
    param('productId')
      .isNumeric()
      .withMessage("The 'productId' parameter must be a numeric value.")
      .run(req),
    param('action')
      .optional()
      .isString()
      .matches(/^(delete|restore)$/)
      .withMessage("Parameter 'action' can be 'delete' or 'restore'.")
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


const validateUpdateProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
    param('productId')
      .isNumeric()
      .withMessage("The 'productId' parameter must be a numeric value.")
      .run(req),
    body('name')
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Product 'name' is required.")
      .run(req),
    body('price')
      .optional()
      .isNumeric()
      .withMessage("Product 'price' must be a number.")
      .notEmpty()
      .withMessage("Product 'price' cannot be empty.")
      .run(req),
    body('quantity')
      .optional()
      .isInt()
      .notEmpty()
      .withMessage("Product 'quantity' must be an integer and is required.")
      .run(req),
    body('description')
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Product 'description' is required.")
      .run(req),

    body()
      .custom(body => {
        const { name, price, quantity, description } = body;

        if ( name === undefined && price === undefined && quantity === undefined && description === undefined) {
          throw new Error('At least one field (name, price, quantity, or description) must be provided to update the product.');
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
  validateGetProducts,
  validateGetDeletedProducts,
  validateGetProduct,
  validateCreateProduct,
  validateSoftDeleteProduct,
  validateUpdateProduct
}