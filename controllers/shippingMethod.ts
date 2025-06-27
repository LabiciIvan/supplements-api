import { FieldPacket }      from 'mysql2';
import BaseController       from '../core/baseController';
import { hasArrayData }     from '../services/functions';
import {
  BaseResponse,
  DataResponse
}                           from '../types';


class shippingMethod extends BaseController {

  constructor() {
    super();
  }


  public async createNewShipping(name: string, price: string): Promise<void> {
    try {
      await this.db.query(
        'INSERT INTO shipping_methods (name, price) VALUES (?, ?)',
        [name, price]
      );

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/createNewShipping(): ', error);
      return (error?.message || 'Internal server error');
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


  public async getShippingDetails(name: string): Promise<DataResponse<{name: string, price: number}> | BaseResponse> {
    try {
      const [shipping]: [any, FieldPacket[]] = await this.db.query(
        "SELECT name, price FROM shipping_methods WHERE name = ?",
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
          name: shipping[0].name,
          price: shipping[0].price
        }
      }

    } catch (error: any) {
      console.log('Error in controllers/shippingMethod/getShippingDetails(): ', error);
      return (error?.message || 'Internal server error');
    }
  }


}

export default shippingMethod;