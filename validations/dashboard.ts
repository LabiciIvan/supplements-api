import { body, param, query, validationResult }           from 'express-validator'
import { Request, Response, NextFunction }                from 'express';


const validateGetMostOrdererProducts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    next();
}


const validateGetTotalRevenue = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    next();
}


const validateGetRevenueAndPercentageDifference = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    next();
}


export {
  validateGetMostOrdererProducts,
  validateGetTotalRevenue,
  validateGetRevenueAndPercentageDifference
}