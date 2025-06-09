import express, { RequestHandler }          from 'express';
import requireToken                         from '../middlewares/requireToken';
import isTokenValid                         from '../middlewares/isTokenValid';
import isAdmin                              from '../middlewares/isAdmin';
import attachToken                          from '../middlewares/attachToken';
import {
  getCategoryHandler,
  createCategoryHandler,
  getCategoriesHandler,
  deleteCategoryHandler,
  patchCategoryHandler
}                                           from '../handlers/categories';
import {
  validateCreateCategory,
  validateGetCategories,
  validateGetCategory,
  validatePatchCategory,
  validateDeleteCategory,
}                                           from '../validations/categories';

const categories = express.Router();


categories.post('/',
  attachToken                   as RequestHandler,
  requireToken                  as RequestHandler,
  isTokenValid                  as RequestHandler,
  isAdmin                       as RequestHandler,
  validateCreateCategory        as RequestHandler,
  createCategoryHandler
);


categories.get('/',
  validateGetCategories         as RequestHandler,
  getCategoriesHandler
);


categories.get('/:categoryId',
  validateGetCategory           as RequestHandler,
  getCategoryHandler
);


categories.patch('/:categoryId',
  attachToken                   as RequestHandler,
  requireToken                  as RequestHandler,
  isTokenValid                  as RequestHandler,
  isAdmin                       as RequestHandler,
  validatePatchCategory         as RequestHandler,
  patchCategoryHandler
);


categories.delete('/:categoryId',
  attachToken                   as RequestHandler,
  requireToken                  as RequestHandler,
  isTokenValid                  as RequestHandler,
  isAdmin                       as RequestHandler,
  validateDeleteCategory        as RequestHandler,
  deleteCategoryHandler
);


export default categories;
