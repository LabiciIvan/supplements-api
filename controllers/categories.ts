import {
  FieldPacket
}                             from 'mysql2/promise';
import {
  hasArrayData
}                             from '../services/functions';
import {
  createdResource,
  duplicateResource,
  categoryResourceInterface,
  resourceNotFound,
  deletedResource,
  categoryModelInterface
}                             from '../types';
import BaseController         from '../core/baseController';


class Categories extends BaseController {

  constructor() {
    super();
  }


  public async getCategoryById(categoryID: number): Promise<resourceNotFound | categoryResourceInterface> {
    try {

      const data: [any[], FieldPacket[]] = await this.db.query(
        'SELECT id, name FROM categories WHERE id = ?',
        [categoryID]
      );

      if (data[0].length === 0) {
        return {message: 'Category not found.'};
      }

      const category: categoryResourceInterface = {
        id: data[0][0].id,
        category: data[0][0].name
      }

      return category;

    } catch (error:any) {
      console.log('error in /controller/categories.tx/getCategoryById(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async getAllCategories(): Promise<resourceNotFound | categoryResourceInterface[]> {
    try {

      const data: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, name FROM categories',
      );

      if (!hasArrayData(data)) {
        return {
          message: 'No categories found.'
        }
      }

      const categories: categoryResourceInterface[] = data[0].map((cat: any) => ({id: cat.id, category: cat.name}));

      return categories;

    } catch (error:any) {
      console.log('error in /controller/categories.tx/getAllCategories(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async createCategory(name: string): Promise<createdResource | duplicateResource> {
    try {
      const insertResult: [any, FieldPacket[]] = await this.db.query(
        'INSERT INTO categories (name) VALUES (?)',
        [name]
      );

      return {
        id: insertResult[0].insertId,
        message: `Category '${name}' created successfully.`
      }

    } catch (error:any) {
      console.log('error in /controller/categories.tx/createCategory(): ', error);

      if (error?.errno === 1062) {
        return {
          message: `Category '${name}' already exists.`
        }
      }

      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async deleteCategory(categoryID: number): Promise<resourceNotFound | deletedResource> {
    try {

      const deleteResult: [any, FieldPacket[]] = await this.db.query(
        'DELETE FROM categories WHERE id = ?',
        [categoryID]
      );

      return {
        message: (deleteResult[0]?.affectedRows === 0 ? `Category ${categoryID} doesn't exist.` : `Category ${categoryID} deleted.`)
      }

    } catch (error:any) {
      console.log('error in /controller/categories.tx/deleteCategory(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async patchCategory(category: categoryModelInterface): Promise<resourceNotFound |createdResource> {
    try {

      const patchResult: [any, FieldPacket[]] = await this.db.query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [category.name, category.id]
      );

      if (patchResult[0]?.affectedRows === 0) {
        return {
          message: `Category with ID ${category.id} not found.`
        };
      }

      return {
        id: category.id,
        message: `Category ${category.id} updated.`
      }

    } catch (error: any) {
      console.log('Error in /controller/categories.ts/patchCategory(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


}


export default Categories;