import express, { RequestHandler }  from 'express';
import attachToken                  from '../middlewares/attachToken';
import isTokenValid                 from '../middlewares/isTokenValid';
import isAdmin                      from '../middlewares/isAdmin';

import {
  getUsersByRoleHandler,
  getUsersHandler,
  updateUserRoleHandler,
  passwordRestUserHandler,
  deleteUserHandler,
  getUserDetailsHandler
}                                   from '../handlers/user';
import {
  validateUsersGet,
  validateGetUsersByRole,
  validateUpdateUserRole,
  validatePasswordRestUser,
  validateDeleteUserHandler,
  validateGetUserDetails
}                                   from '../validations/users';


const users = express.Router();


// Get users data.
users.get('/',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validateUsersGet                  as RequestHandler,
  getUsersHandler
);


// Get users data based on specific user role.
users.get('/specifics/',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validateGetUsersByRole            as RequestHandler,
  getUsersByRoleHandler
);


// Get users data based on specific user role.
users.put('/update',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validateUpdateUserRole            as RequestHandler,
  updateUserRoleHandler
);


users.get('/password-reset/:email',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validatePasswordRestUser          as RequestHandler,
  passwordRestUserHandler
);


users.delete('/delete/:email',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validateDeleteUserHandler         as RequestHandler,
  deleteUserHandler
);


// Get users data based on specific user role.
users.get('/details/:email',
  attachToken                       as RequestHandler,
  isTokenValid                      as RequestHandler,
  isAdmin                           as RequestHandler,
  validateGetUserDetails           as RequestHandler,
  getUserDetailsHandler
);


export default users;

