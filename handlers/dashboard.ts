import { Request, Response, NextFunction } from 'express';
import Dashboard from '../controllers/dashboard';


const DashboardController = new Dashboard();


const getMostOrderedProducts = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
  try {

    const dashboardData = await DashboardController.getMostOrderedProducts();

    res.status(200).json(dashboardData);

  } catch (error: any) {
    console.log('Error in handlers/dashboard/getMostOrderedProducts(): ', error);
  }
}


const getTotalRevenue = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
  try {

    const {year, month, day} = req.params;

    const totalRevenue = await DashboardController.calculateTotalRevenue(year, month, day);

    res.status(200).json(totalRevenue);

  } catch (error: any) {
    console.log('Error in handlers/dashboard/getMostOrderedProducts(): ', error);
  }
}


const getRevenueAndPercentageDifference = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
  try {


    const revenueAndPercentageDifference = await DashboardController.revenueAndPercentageDifference();

    res.status(200).json(revenueAndPercentageDifference);

  } catch (error: any) {
    console.log('Error in handlers/dashboard/getMostOrderedProducts(): ', error);
  }
}


export {
  getMostOrderedProducts,
  getTotalRevenue,
  getRevenueAndPercentageDifference
  
}