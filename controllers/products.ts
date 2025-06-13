import {
  FieldPacket,
}                           from 'mysql2/promise';
import {
  createProductInterface,
  deletedProductInterface,
  productInterface,
  updateProduct
}                           from '../types';
import BaseController       from '../core/baseController';

/**
 * Products class.
 *
 * This class handles user create and fetch of products.
 *
 * @class Auth
 */
class Products extends BaseController {


  /**
   * The allowed categories in the categories table;
   */
  static categories: string[] = [
    'Protein Powders',
    'Pre-Workout',
    'Post-Workout',
    'Amino Acids',
    'Vitamins & Minerals',
    'Weight Gainers',
    'Fat Burners',
    'Energy Drinks',
    'Meal Replacements',
    'Creatine',
    'Testosterone Boosters',
    'Joint Support',
    'Omega-3 & Fish Oils',
    'Probiotics',
    'Herbal Supplements',
    'Hydration & Electrolytes',
    'Sleep Aids',
    'Immune Support',
    'Snacks & Bars',
    'Greens & Superfoods'
  ] as const;


  constructor() {
    super();
  }


  public async getAllProductsFromCategory(category: (typeof Products.categories)[number]): Promise<any[]> {
    try {
      const products: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          p.id,
          p.name,
          p.description,
          p.price,
          p.quantity,
          c.name AS category
        FROM products AS p INNER JOIN categories AS c ON p.category_id = c.id WHERE c.name = ? AND p.deleted = 0`,
        [category]
      );

      return products[0];

    } catch (error: any) {
      console.log('Error in /controller/products.ts/getAllProductsFromCategory(): ', error);
      throw new Error('Error fetching products from the database.');
    }
  }


  public async getProductById(productId: number, deleted: 1|0 = 0): Promise<any[]> {
    try {
      const product: [any, FieldPacket[]] = await this.db.query(
        `SELECT
            p.id,
            p.name,
            p.price,
            p.quantity,
            c.name AS category
        FROM products AS p INNER JOIN categories AS c ON p.category_id = c.id WHERE p.id = ? AND p.deleted = ?`,
        [productId, deleted]
      );

      return product[0];

    } catch (error: any) {
      console.log('Error in /controller/products.ts/getProductById(): ', error);
      throw new Error('Error fetching product from the database.');
    }
  }


  public async getProductsByMultipleId(productIds: number[]): Promise<productInterface[]> {
    try {
      const products: [any, FieldPacket[]] = await this.db.query(
        `SELECT
            id,
            name,
            price,
            quantity
          FROM products WHERE id IN (?) AND deleted = 0`,
        [productIds]
      );

      return products[0];
    } catch (error: any) {
      console.log('Error in /controller/products.ts/getProductsByMultipleId(): ', error);
      throw new Error('Error fetching products from the database.');
    }
  }


  public async getDeletedProducts(): Promise<deletedProductInterface[]> {
    try {
      const products: [any, FieldPacket[]] = await this.db.query(
        `SELECT
            p.id,
            p.updated_at AS deleted_at,
            p.name,
            p.price,
            p.quantity,
            c.name AS category
          FROM products AS p 
          INNER JOIN categories AS c ON p.category_id = c.id
          WHERE p.deleted = 1`,
      );

      return products[0];
    } catch (error: any) {
      console.log('Error in /controller/products.ts/getProductsByMultipleId(): ', error);
      throw new Error('Error fetching products from the database.');
    }
  }


  public async createProduct(product: createProductInterface): Promise<any> {

    const { name, description, price, quantity, category, createdBy} = product;

    try {
      const [productId]: [any, FieldPacket[]] = await this.db.query(
        `INSERT INTO products (name, description, price, quantity, category_id) VALUES (?, ?, ?, ?, ?)`,
        [name, description, price, quantity, category, createdBy]
      );

      return  {
        productId: productId.insertId,
        message: 'Product created successfully'
      }

    } catch (error: any) {
      console.log('Error in /controller/products.ts/createProduct(): ', error);
      throw new Error('Error creating product in the database.');
    }
  }


  /**
   * Update products table quantity.
   *
   * Substracts the database product quantity with the quantity of product placed in order.
   *
   * @param products - products array with 'id' and 'quantity' that must be substracted from
   *                    existing quantity in the table.
   *
   * @param action -   the action on the product update, by default is set to '-' which is used to
   *                   substract the quantity, if '+' is used will add to the quantity.
   */
  public async updateProductsQuantity(products: productInterface[], action: '-' | '+' = '-'): Promise<void> {
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();

      for (const product of products) {
        await connection.query(
          `UPDATE products SET quantity = quantity ${action} ? WHERE id = ?`,
          [product.quantity, product.id]
        )
      };

      await connection.commit();
    } catch (error: any) {
      await connection.rollback();
      console.log('Error in /controller/products.ts/updateProductsQuantity(): ', error);
      throw new Error('Error updating products in the database.');
    }
  }


  public async updateProduct(productId: number, name?: string, description?: string, price?: number, quantity?: number): Promise<updateProduct> {
    const connection = await this.db.getConnection();

    const fieldsUpdate: any[] = [];

    const fieldsValue: any[] = [];

    if (name !== undefined && name.length > 0) {
      fieldsUpdate.push('name = ?');
      fieldsValue.push(name);
    }

    if (description !== undefined && description.length > 0) {
      fieldsUpdate.push('description = ?');
      fieldsValue.push(description);
    }

    if (price !== undefined && price > 0) {
      fieldsUpdate.push('price = ?');
      fieldsValue.push(price);
    }

    if (quantity !== undefined && quantity > -1) {
      fieldsUpdate.push('quantity = ?');
      fieldsValue.push(quantity);
    }

    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE products SET ${fieldsUpdate.join(',')} WHERE id = ?`,
        [...fieldsValue, productId]
      )

      await connection.commit();

      return {
        id: productId,
        message: `Product ${productId} successfully updated.`
      }
      
    } catch (error: any) {
      await connection.rollback();
      console.log('Error in /controller/products.ts/updateProduct(): ', error);
      throw new Error('Error updating products in the database.');
    }
  }


  /**
   * Delete product from database.
   *
   * Deletes the product from database by updating the deleted column to 1 (Boolean 'YES').
   *
   * It can be used to restore the product by passing the action parameter to 0 (Boolean 'NO').
   * 
   * @param productId - product id from the database, which is going to be deleted or restored.
   *
   * @param action    - specifies what action should be taken on the product, by default is set to
   *                    value 1 (DELETE product), value of 0 (RESTORE product).
   *
   * @returns         - an 'updateProduct' interface which has the product id and a message.
   */
  public async softDeleteProduct(productId: number, action: 1|0 = 1): Promise<updateProduct> {
    try {

      await this.db.query(
        `UPDATE products SET deleted = ${action} WHERE id = ?`,
        [productId]
      )

      return {
        id: productId,
        message: `Product ${action === 1 ? 'deleted' : 'restored'} successfully.`
      }

    } catch (error: any) {
      console.log('Error in /controller/products.ts/deleteProduct(): ', error);
      throw new Error('Error deleting products in the database.');
    }
  }
  

}


export default Products;
