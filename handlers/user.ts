import fs                     from 'fs';
import path                   from 'path';
import {
  Request,
  Response,
  NextFunction
}                             from 'express';
import User                   from '../controllers/users';
import { PaginationOptions }  from '../types';
import Auth                   from '../controllers/authentication';
import { hasArrayData }       from '../services/functions';
import sendEmail              from '../core/emailer';


const usersController = new User();


const getUsersHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const deleted = req.query.deleted === 'true';

    const options: PaginationOptions = {
      resultLimit: parseInt(String(req.query.limit || 20)),
      page: parseInt(String(req.query.page))
    }

    const usersData = await usersController.getUsers(deleted, options);

    if ('status' in usersData && usersData.status === 'fail') {
      res.status(404).json(usersData);
      return;
    }

    res.status(200).json(usersData);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/getUsersHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


const getUsersByRoleHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const deleted = req.query.deleted === 'true';
    const role = String(req.query.role);

    const options: PaginationOptions = {
      resultLimit: parseInt(String(req.query.limit || 20)),
      page: parseInt(String(req.query.page))
    }

    const usersData = await usersController.getUsersByRole(role, deleted, options);

    if ('status' in usersData && usersData.status === 'fail') {
      res.status(404).json(usersData);
      return;
    }

    res.status(200).json(usersData);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/getUsersByRoleHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


const updateUserRoleHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const role    = req.body.role;
    const email   = req.body.email;

    const authController = new Auth();

    const user = await authController.checkUserExists(email);

    // Do not proceed to user user which doesn't exist.
    if (!hasArrayData(user)) {
      res.status(404).json({status: 'fail', message: 'User not found.'});
      return;
    }

    if (user[0].role === role) {
      res.status(400).json({status: 'fail', message: 'User role already allocated.'});
      return;
    }

    const usersData = await usersController.updateUserRole(role, user[0].id);

    if ('status' in usersData && usersData.status === 'fail') {
      res.status(404).json(usersData);
      return;
    }

    res.status(200).json(usersData);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/updateUserRoleHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}



const passwordRestUserHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const email = req.params.email;

    const resetToken = await usersController.generatePasswordResetForUser(email);

    if ('message' in resetToken) {
      res.status(400).json(resetToken);
      return;
    }

    let emailResetPasswordTemplate = fs.readFileSync(path.join(__dirname + '/../emails-templates/passwordReset.html'), 'utf8');

    const resetLink = (process.env.APP_ENV === 'development' ? process.env.APP_DEV_CLIENT_URL : process.env.APP_PROD_CLIENT_URL) + `auth/password-reset/${resetToken.token}`;

    emailResetPasswordTemplate = emailResetPasswordTemplate.replace('USER', email);
    emailResetPasswordTemplate = emailResetPasswordTemplate.replace('PASSWORD_RESET_LINK', resetLink);

    await sendEmail(email, `Password reset for: ${email}`, emailResetPasswordTemplate)

    res.status(200).json({message:'Reset password email sent.'});

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/passwordRestUserHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


const deleteUserHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const email = req.params.email;

    const deleteAction = await usersController.deleteUserAccount(email);

    let emailTemplate = fs.readFileSync(path.join(__dirname + '/../emails-templates/accountSuspension.html'), 'utf8');

    emailTemplate = emailTemplate.replace('Customer', email);

    const emailTitle = "[No Reply] Important: Your Supplements-Store Account Has Been Suspended";

    await sendEmail(email, emailTitle, emailTemplate);

    res.status(200).json(deleteAction);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/deleteUserHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


const getUserDetailsHandler = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const email = req.params.email;

    const userDetails = await usersController.getUserDetails(email);

    if ('status' in userDetails && userDetails.status === 'fail') {
        res.status(404).json(userDetails);
        return;
    }

    res.status(200).json(userDetails);

  } catch (error: any) {
    console.log('Error in /handlers/orders.tx/getUserDetailsHandler(): ', error);

    res.status(500).json({
      status: 'error',
      message: 'We\'re experiencing technical difficulties. Try again later or contact support for assistance.'
    });

    return;
  }
}


export {
  getUsersHandler,
  getUsersByRoleHandler,
  updateUserRoleHandler,
  passwordRestUserHandler,
  deleteUserHandler,
  getUserDetailsHandler
}