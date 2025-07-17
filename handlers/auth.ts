import { Request, Response, NextFunction }  from 'express';
import Auth                                 from '../controllers/authentication';
import { 
  decodeJwtToken,
  hasArrayData,
  hashPassword, 
  isStringValidEmail 
}                                           from '../services/functions';
import sendEmail                            from '../core/emailer';

// Authentication controller which interacts with the database.
const authController = new Auth();

const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const IP        = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

    const userAgent = req.headers['user-agent'] as string;

    const login     = await authController.login(req.body.email, req.body.password, IP, userAgent);

    if ('message' in login) {
      res.status(400).json({
        status: 'fail',
        errors: [{
          path: 'email',
          msg: login.message
        }]
      })
      return;
    }

    if ('token' in login) {
      res.status(200).json(login);
      return;
    }

  } catch (error: any) {
    console.log('Error in /handlers/auth.ts/loginHandler: ', error);
    // MySQL or Server error
    res.status(500).json({
      message: error?.message || 'Internal server error.',
    });
  }
};


const registerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const registration = await authController.register(req.body.username, req.body.email, hashPassword(req.body.password));

    // User registration successful
    if (registration.userId) {
      res.status(201).json({
        message: registration.message,
        userId: registration.userId,
      });
    } else {
      // There is already a user with the same username or email
      res.status(400).json({
        message: registration.message,
      });
    }
  } catch (error: any) {
    console.log('Error in /handlers/auth.ts/registerHandler: ', error)
    // MySQL or Server error
    if (error.message === 'Username or email already exists') {
      res.status(400).json({
        status: 'fail',
        errors: [{
          path: 'email',
          msg: error.message
        }]
      })
      return;
    }
    res.status(500).json({
      message: error?.message || 'Internal server error.',
    });
  }
}


const logoutHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    await authController.logout((req as any).bearerToken);

    res.status(200).json({
      message: 'Logout successful',
    });

  } catch (error: any) {
    console.log('Error in /handlers/auth.ts/logoutHandler: ', error);
    // MySQL or Server error
    res.status(500).json({
      message: error?.message || 'Internal server error.',
    });
  }
}


const deleteHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 try {
    const token = (req as any).bearerToken;

    const result = await authController.delete(token);

    res.status(200).json(result);

 } catch (error: any) {
  console.log('Error in /handlers/auth.ts/deleteHandler(): ', error);
  res.status(500).json({
    message: error?.message || 'Internal server error.'
  });
 }
}


const sendPasswordResetEmailHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 try {

    const email = req.params.email;

    if (Number(email)) {
      res.status(400).json({
        message: 'The email parameter must be a valid email address.'
      });
      return;
    }

    // Validate the string is a proper email address.
    if (!isStringValidEmail(email)) {
      res.status(400).json({
        message: 'The email is not a valid email address.'
      });
      return;
    }

    // Verify if user exists.
    const user = await authController.checkUserExists(email);

    if (!hasArrayData(user)) {
      res.status(404).json({
        message: 'No account found with this email address.'
      });
      return;
    }

    const tokenGenerationResult = await authController.generatePasswordResetToken(email);

    if ('message' in tokenGenerationResult) {
      res.status(400).json(tokenGenerationResult);
      return;
    }

    await sendEmail(email, `Password reset for: ${email}`, `To reset your password submit new_password field using this link: http://localhost:3000/api/auth/password-reset/${tokenGenerationResult.token}`)

    res.status(200).json({message:'Reset password email sent.'});

 } catch (error: any) {
  console.log('Error in /handlers/auth.ts/passwordResetEmailHandler(): ', error);
  res.status(500).json({
    message: error?.message || 'Internal server error.'
  });
 }
}


const resetUserPasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 try {
    const resetPasswordToken = req.params.resetPasswordToken;

    const newPassword = req.body.password;

    if (!newPassword) {
      res.status(400).json({message: "The 'password' field is required and must be included in the request body."});
      return;
    }

    const payload = await decodeJwtToken(resetPasswordToken);

    if (!payload || !payload.userEmail) {
      res.status(400).json({status: 'fail', message: 'The password reset token is invalid or malformed.'});
      return;
    }

    const isTokenValid = await authController.isResetTokenValid(resetPasswordToken);

    if (!isTokenValid) {
      res.status(400).json({status: 'fail', message: 'The password reset token has been used.'});
      return;
    }

    const passwordUpdateResult = await authController.resetUserPassword(hashPassword(newPassword), payload.userEmail as string)

    res.status(200).json(passwordUpdateResult);

 } catch (error: any) {
  console.log('Error in /handlers/auth.ts/resetUserPasswordHandler(): ', error);
  res.status(500).json({
    message: error?.message || 'Internal server error.'
  });
 }
}


export {
  loginHandler,
  registerHandler,
  logoutHandler,
  deleteHandler,
  sendPasswordResetEmailHandler,
  resetUserPasswordHandler
}