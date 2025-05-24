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

    const fetchedResult = await categoriesController.getAllCategories();

    res.status(200).json(fetchedResult);

  } catch (error: any) {
    res.status(500).json({
      message: error?.message || 'Internal server error.'
    })
  }
}


// Get category
const getCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const fetchedResult = await categoriesController.getCategoryById(parseInt(categoryId));

    if ('message' in fetchedResult) {
      res.status(404).json(fetchedResult);
      return;
    }

    res.status(200).json(fetchedResult);

  } catch (error: any) {
    console.log('Error in /handlers/categories/getCategoryHandler(): ', error);

    res.status(500).json({
      message: error.message || 'Internal server error.'
    });
  }
}


// Create category - admin
const createCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {categoryName} = req.body;

    const createdData = await categoriesController.createCategory(categoryName);

    res.status(200).json(createdData);

  } catch (error: any) {
    console.log('Error in /handlers/categories.tx/createCategoryHandler(): ', error);
    res.status(500).json({
      message: error.message || 'Internal server error.'
    })
  }
}


// Delete category - admin
const deleteCategoryHandler = async (req: Request, res: Response, next: NextFunction):  Promise<void> => {
  try {
    const { categoryId } = req.params;

    const deletedData = await categoriesController.deleteCategory(parseInt(categoryId));

    res.status(200).json(deletedData);

  } catch (error: any) {
    console.log('Error in /handlers/categories.tx/deleteCategoryHandler(): ', error);

    res.status(500).json({
      message: error?.message || 'Internal sever error.'
    })
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

    const patchedData = await categoriesController.patchCategory(category);

    res.status(200).json(patchedData);

  } catch (error: any) {
    console.log('Error in /handlers/categories.tx/deleteCategoryHandler(): ', error);

    res.status(500).json({
      message: error?.message || 'Internal sever error.'
    })
  }
}

export {
  getCategoryHandler,
  createCategoryHandler,
  getCategoriesHandler,
  deleteCategoryHandler,
  patchCategoryHandler
}