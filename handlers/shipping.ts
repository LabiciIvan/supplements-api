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

    const { shippingName } = req.params;

    const previousShipping = await ShippingController.getShippingDetails(shippingName);

    if (previousShipping.status === 'fail' || !('data' in previousShipping)) {
      res.status(404).json(previousShipping);
      return;
    }

    const { id, name: oldName, price: oldPrice } = previousShipping.data;

    const name = req.body?.name || oldName;
    const price = req.body?.price || oldPrice;

    const createNewShipping = await ShippingController.updateShipping(id, name, price);

    res.status(200).json(createNewShipping);

  } catch (error: any) {
    console.log('Error in handlers/shipping/updateShippingHandler(): ', error);
    res.status(505).json({
      message: (error?.message || 'Internal server error')
    });
  }
}


const deleteShippingHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {

    const { shippingName } = req.params;

    const previousShipping = await ShippingController.getShippingDetails(shippingName);

    if (previousShipping.status === 'fail' || !('data' in previousShipping)) {
      res.status(404).json(previousShipping);
      return;
    }

    const {id} = previousShipping.data;

    const deleteShipping = await ShippingController.deleteShipping(id);

    res.status(200).json(deleteShipping);

  } catch (error: any) {
    console.log('Error in handlers/shipping/deleteShippingHandler(): ', error);
    res.status(505).json({
      message: (error?.message || 'Internal server error')
    });
  }
}


const createShippingHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {

    const {name, price} = req.body;

    const shippingCreated = await ShippingController.createNewShipping(name, price);

    res.status(200).json(shippingCreated);

  } catch (error: any) {
    // console.log('Error in handlers/shipping/createShippingHandler(): ', error);
    console.log('error.errno', error.errno)

    const errorMessage = (error.errno === 1062 ? error.sqlMessage : 'Internal server error');

    res.status(505).json({
      status: 'error',
      message: errorMessage
    });
  }
}


export {
  getShippingHandler,
  updateShippingHandler,
  deleteShippingHandler,
  createShippingHandler
}