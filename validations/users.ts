import { body, param, query, validationResult }      from 'express-validator';
import { Request, Response, NextFunction }    from 'express';


const validateUsersGet = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    query('page')
      .exists().withMessage('Page is required')
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0')
      .run(req),

    query('limit')
      .optional()
      .isInt({ min: 1 }).withMessage('Limit must be a positive integer')
      .run(req),

    query('deleted')
      .exists().withMessage('Deleted is required')
      .isBoolean().withMessage('Deleted must be true or false')
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


const validateGetUsersByRole = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  const supportedRoles = ['customer', 'merchant', 'admin'];

  await Promise.all([
    query('page')
      .exists().withMessage('Page is required')
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0')
      .run(req),

    query('limit')
      .optional()
      .isInt({ min: 1 }).withMessage('Limit must be a positive integer')
      .run(req),

    query('deleted')
      .exists().withMessage('Deleted is required')
      .isBoolean().withMessage('Deleted must be true or false')
      .run(req),

    query('role')
    .exists().withMessage('Role is required')
    .isIn(supportedRoles).withMessage('Role must be one of: customer, merchant, admin')
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


const validateUpdateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  const supportedRoles = ['customer', 'merchant', 'admin'];

  await Promise.all([
    body('role')
      .exists().withMessage('Role is required')
      .isIn(supportedRoles).withMessage('Role must be one of: customer, merchant, admin')
      .run(req),

    body('email')
      .isEmail().withMessage("Invalid email format.")
      .notEmpty().withMessage("Email cannot be empty.")
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


const validatePasswordRestUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('email')
      .isEmail().withMessage("Invalid email format.")
      .notEmpty().withMessage("Email cannot be empty.")
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


const validateDeleteUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('email')
      .isEmail().withMessage("Invalid email format.")
      .notEmpty().withMessage("Email cannot be empty.")
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


const validateGetUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

  await Promise.all([
    param('email')
      .isEmail().withMessage("Invalid email format.")
      .notEmpty().withMessage("Email cannot be empty.")
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
  validateUsersGet,
  validateGetUsersByRole,
  validateUpdateUserRole,
  validatePasswordRestUser,
  validateDeleteUserHandler,
  validateGetUserDetails
}