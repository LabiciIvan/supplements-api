import { body, param, query, validationResult }           from 'express-validator'
import { Request, Response, NextFunction }                from 'express';


const validateCreateCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await
    body('categoryName')
      .isString()
      .withMessage("Parameter 'categoryName' must be a string.")
      .notEmpty()
      .withMessage("Parameter 'categoryName' can't be empty.")
      .run(req);

  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  next();
}


const validateGetCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  // No validation yet to get categories
  next();
}


const validateGetCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await
    param('categoryId')
      .isInt()
      .withMessage("Parameter 'categoryName' must be a numeric value.")
      .notEmpty()
      .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  next();
}


const validatePatchCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await Promise.all([
    param('categoryId')
      .isInt()
      .withMessage("Parameter 'categoryName' must be a numeric value.")
      .notEmpty()
      .run(req),
    body('categoryName')
      .isString()
      .withMessage("Parameter 'categoryName' must be a string.")
      .notEmpty()
      .withMessage("Parameter 'categoryName' can't be empty.")
      .run(req)

  ]);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  next();
}


const validateDeleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  await
    param('categoryId')
      .isInt()
      .withMessage("Parameter 'categoryName' must be a numeric value.")
      .notEmpty()
      .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  next();
}


export {
  validateCreateCategory,
  validateGetCategories,
  validateGetCategory,
  validatePatchCategory,
  validateDeleteCategory,
}