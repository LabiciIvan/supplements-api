import {
  FieldPacket
}                             from 'mysql2/promise';
import {
  hasArrayData
}                             from '../services/functions';
import {
  categoryModelInterface,
  DataResponse,
  BaseResponse
}                             from '../types';
import BaseController         from '../core/baseController';


class Categories extends BaseController {

  constructor() {
    super();
  }


  public async getCategoryById(categoryID: number): Promise<DataResponse<{id: number, category: string}> | BaseResponse> {
    try {

      const data: [any[], FieldPacket[]] = await this.db.query(
        'SELECT id, name FROM categories WHERE id = ?',
        [categoryID]
      );

      if (data[0].length === 0) {
          return {
          status: this.fail,
          message: 'Category not found.',
        };
      }

      return  {
        status: this.success,
        message: 'Category fetched successfully.',
        data: {
          id: data[0][0].id,
          category: data[0][0].name
        }
      }

    } catch (error:any) {
      console.log('error in /controller/categories.tx/getCategoryById(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async getAllCategories(): Promise<DataResponse<{id: number, category: string}[]> | BaseResponse> {
    try {

      const data: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, name FROM categories',
      );

      if (!hasArrayData(data)) {
        return {
          status: this.fail,
          message: 'No categories found.'
        }
      }

      const categories: {id: number, category: string}[] = data[0].map((cat: any) => ({id: cat.id, category: cat.name}));

      return {
        status: this.success,
        message: 'Categories fetched successfully.',
        data: categories
      }

    } catch (error:any) {
      console.log('error in /controller/categories.tx/getAllCategories(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async createCategory(name: string): Promise<DataResponse<{id: number}> | BaseResponse> {
    try {
      const insertResult: [any, FieldPacket[]] = await this.db.query(
        'INSERT INTO categories (name) VALUES (?)',
        [name]
      );

      return {
        status: this.success,
        message: `Category '${name}' created successfully.`,
        data: { id: insertResult[0].insertId}
      }

    } catch (error:any) {
      console.log('error in /controller/categories.tx/createCategory(): ', error);

      if (error?.errno === 1062) {
        return {
          status: this.fail,
          message: `Category '${name}' already exists.`
        }
      }

      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async deleteCategory(categoryID: number): Promise<BaseResponse> {
    try {

      const deleteResult: [any, FieldPacket[]] = await this.db.query(
        'DELETE FROM categories WHERE id = ?',
        [categoryID]
      );

      return {
        status: (deleteResult[0]?.affectedRows === 0 ? this.fail : this.success),
        message: (deleteResult[0]?.affectedRows === 0 ? `Category ${categoryID} doesn't exist.` : `Category ${categoryID} deleted.`)
      }

    } catch (error:any) {
      console.log('error in /controller/categories.tx/deleteCategory(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


  public async patchCategory(category: categoryModelInterface): Promise<BaseResponse> {
    try {

      const patchResult: [any, FieldPacket[]] = await this.db.query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [category.name, category.id]
      );

      if (patchResult[0]?.affectedRows === 0) {
        return {
          status: this.fail,
          message: `Category with ID ${category.id} not found.`
        };
      }

      return {
        status: this.success,
        message: `Category ${category.id} updated.`
      }

    } catch (error: any) {
      console.log('Error in /controller/categories.ts/patchCategory(): ', error);
      throw new Error(error.message || 'Internal server error.');
    }
  }


}


export default Categories;