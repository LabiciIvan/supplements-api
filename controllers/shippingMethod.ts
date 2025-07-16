import { FieldPacket }      from 'mysql2';
import BaseController       from '../core/baseController';
import { hasArrayData }     from '../services/functions';
import {
  BaseResponse,
  DataResponse
}                           from '../types';


class ShippingMethod extends BaseController {

  constructor() {
    super();
  }


  public async createNewShipping(name: string, price: string): Promise<BaseResponse> {
    try {
      await this.db.query(
        'INSERT INTO shipping_methods (name, price) VALUES (?, ?)',
        [name, price]
      );

      return {
        status: this.success,
        message: 'Shipping method created',
      }

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/createNewShipping(): ', error);

      // throw error further to handel it inside the handler.
      throw error;
    }
  }


  public async getShippingMethods(): Promise<BaseResponse | DataResponse<{}>> {
    try {
      const [shipping]: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, name, price FROM shipping_methods'
      );

      if (!hasArrayData(shipping)) {
        return {
          status: this.fail,
          message: 'Shipping methods don\'t exist.'
        }
      }

      return {
        status: this.success,
        message: 'Shipping methods fetched successfully.',
        data: shipping,
      };

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/getShippingMethods(): ', error);
      return (error?.message || 'Internal server error');
    }
  }


  public async getShippingDetails(name: string): Promise<DataResponse<{id: number, name: string, price: number}> | BaseResponse> {
    try {
      const [shipping]: [any, FieldPacket[]] = await this.db.query(
        "SELECT id, name, price FROM shipping_methods WHERE name = ?",
        [name]
      );

      if (!hasArrayData(shipping)) {
        return {
          status: this.fail,
          message: 'Couldn\'t identify the shipping method, pick a valid shipping method.'
        }
      }

      return {
        status: this.success,
        message: 'Shipping method fetched successfully',
        data: {
          id: shipping[0].id,
          name: shipping[0].name,
          price: shipping[0].price
        }
      }

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/getShippingDetails(): ', error);
      return {
        status: this.fail,
        message: error?.message || 'Internal server error',
      };
    }
  }



  public async updateShipping(id:number, name: string, price: string): Promise<BaseResponse> {
    try {
      await this.db.query(
        'UPDATE shipping_methods SET name = ?, price = ? WHERE id = ?',
        [name, price, id]
      );

      return {
        status: this.success,
        message: 'Shipping method updated.',
      }

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/updateShipping(): ', error);

      // throw error further to handel it inside the handler.
      throw error;
    }
  }


  
  public async deleteShipping(id:number): Promise<BaseResponse> {
    try {
      await this.db.query(
        'DELETE FROM shipping_methods WHERE id = ?',
        [id]
      );

      return {
        status: this.success,
        message: 'Shipping method deleted.',
      }

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/updateShipping(): ', error);

      // throw error further to handel it inside the handler.
      throw error;
    }
  }


}

export default ShippingMethod;