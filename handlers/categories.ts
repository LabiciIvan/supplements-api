import {
  Request,
  Response, 
  NextFunction 
}                                 from 'express';
import Categories                 from '../controllers/categories';
import { categoryModelInterface } from '../types';


const categoriesController = new Categories();


// Get all categories
const getCategoriesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const categories = await categoriesController.getAllCategories();

    if ('status' in categories && categories.status === 'fail') {
      res.status(404).json(categories);
      return;
    }

    res.status(200).json(categories);

  } catch (error: any) {
    console.log('Error in /handlers/categories/getCategoriesHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}


// Get category
const getCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const category = await categoriesController.getCategoryById(parseInt(categoryId));

    if ('status' in category && category.status === 'fail') {
      res.status(404).json(category);
      return;
    }

    res.status(200).json(category);

  } catch (error: any) {
    console.log('Error in /handlers/categories/getCategoryHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}


// Create category - admin
const createCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {categoryName} = req.body;

    const createdCategory = await categoriesController.createCategory(categoryName);

    if ('status' in createdCategory && createdCategory.status === 'fail') {
      res.status(404).json(createdCategory);
      return;
    }

    res.status(200).json(createdCategory);

  } catch (error: any) {
    console.log('Error in /handlers/categories.tx/createCategoryHandler(): ', error);
    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}


// Delete category - admin
const deleteCategoryHandler = async (req: Request, res: Response, next: NextFunction):  Promise<void> => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await categoriesController.deleteCategory(parseInt(categoryId));

    const httpStatus = ('status' in deletedCategory && deletedCategory.status === 'fail' ? 404 : 200);

    res.status(httpStatus).json(deletedCategory);

  } catch (error: any) {
    console.log('Error in /handlers/categories.tx/deleteCategoryHandler(): ', error);
    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}


// Patch category - admin
const patchCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const { categoryName } = req.body;

    const category: categoryModelInterface = {
      id: parseInt(categoryId),
      name: categoryName
    }

    const patchedCategory = await categoriesController.patchCategory(category);

    const httpStatus = ('status' in patchedCategory && patchedCategory.status === 'fail' ? 404 : 200);

    res.status(httpStatus).json(patchedCategory);

  } catch (error: any) {
    console.log('Error in /handlers/categories.tx/deleteCategoryHandler(): ', error);
    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });
    return;
  }
}

export {
  getCategoryHandler,
  createCategoryHandler,
  getCategoriesHandler,
  deleteCategoryHandler,
  patchCategoryHandler
}