import {
  Request,
  Response,
  NextFunction
}                         from 'express';
import ShippingMethod     from '../controllers/shippingMethod';


const ShippingController = new ShippingMethod();


const getShippingHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {

    const shippingMethods = await ShippingController.getShippingMethods();

    if ('status' in shippingMethods && shippingMethods.status === 'fail' ) {
      res.status(400).json(shippingMethods);
      return;
    }

    res.status(200).json(shippingMethods);
  } catch (error: any) {
    console.log('Error in handlers/shipping/getShippingHandler(): ', error);
    res.status(505).json({
      message: (error?.message || 'Internal server error')
    });
  }
}


const updateShippingHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {

  } catch (error: any) {
    console.log('Error in handlers/shipping/updateShippingHandler(): ', error);
    res.status(505).json({
      message: (error?.message || 'Internal server error')
    });
  }
}


const deleteShippingHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {

  } catch (error: any) {
    console.log('Error in handlers/shipping/deleteShippingHandler(): ', error);
    res.status(505).json({
      message: (error?.message || 'Internal server error')
    });
  }
}


const createShippingHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {

  } catch (error: any) {
    console.log('Error in handlers/shipping/createShippingHandler(): ', error);
    res.status(505).json({
      message: (error?.message || 'Internal server error')
    });
  }
}


export {
  getShippingHandler,
  updateShippingHandler,
  deleteShippingHandler,
  createShippingHandler
}