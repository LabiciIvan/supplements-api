import { RequestHandler }   from 'express';
import express              from 'express';
import requireToken         from '../middlewares/requireToken';
import isTokenValid         from '../middlewares/isTokenValid';
import attachToken          from '../middlewares/attachToken';

import {
  loginHandler,
  logoutHandler,
  registerHandler,
  deleteHandler,
  sendPasswordResetEmailHandler,
  resetUserPasswordHandler
}                           from '../handlers/auth';


import {
  validateLoginUser,
  validateRegisterUser
}                           from '../validations/auth';


const auth = express.Router();


// Log in to the application.
auth.post('/login', validateLoginUser as RequestHandler, loginHandler);


// Register a new user.
auth.post('/register', validateRegisterUser as RequestHandler, registerHandler);


// Log out from the application.
auth.post('/logout', attachToken as RequestHandler, requireToken as RequestHandler, isTokenValid as RequestHandler, logoutHandler);


// Delete user from the application.
auth.delete('/delete', attachToken as RequestHandler, requireToken as RequestHandler, isTokenValid as RequestHandler, deleteHandler);


// Send password reset email to the user.
auth.get('/password-reset-email/:email', sendPasswordResetEmailHandler);


// Reset user password using the token as validation.
auth.post('/password-reset/:resetPasswordToken', resetUserPasswordHandler);


export default auth;
