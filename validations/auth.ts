import { body, param, query, validationResult }           from 'express-validator'
import { Request, Response, NextFunction }                from 'express';


const validateLoginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
      body('email')
        .isEmail().withMessage("Invalid email format.")
        .notEmpty().withMessage("Email cannot be empty.")
        .run(req),

      body('password')
        .notEmpty().withMessage("Password cannot be empty.")
        .run(req),
    ]);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'failed',
        message: 'Validation failed.',
        errors: errors.array()
      });
    }

    next();
}


const validateRegisterUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
      body('username')
        .isString().withMessage("Username must be a string.")
        .notEmpty().withMessage("Username cannot be empty.")
        .run(req),

      body('email')
        .isEmail().withMessage("Invalid email format.")
        .notEmpty().withMessage("Email cannot be empty.")
        .run(req),

      body('password')
        .notEmpty().withMessage("Password cannot be empty.")
        .isLength({ min: 10 }).withMessage("Password must be at least 10 characters long.")
        .matches(/[a-z]/).withMessage("Password must contain a lowercase letter.")
        .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
        .matches(/\d/).withMessage("Password must contain a number.")
        .run(req),

      body('password_confirm')
        .notEmpty().withMessage("Password confirmation cannot be empty.")
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match.');
          }
          return true;
        })
        .run(req)
    ]);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'failed',
        message: 'Validation failed.',
        errors: errors.array()
      });
    }

    next();
}

export {
  validateLoginUser,
  validateRegisterUser,
}