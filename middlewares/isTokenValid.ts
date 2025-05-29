import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';

import DB from '../core/database';
import { FieldPacket } from 'mysql2';
import { hasArrayData } from '../services/functions';

/**
 * Checks the token using the JWT secret if is valid and not expired and if token was signed by the
 * API and exists in the database.
 *
 * The token is attached to the request object for further processing, under req.bearerToken.
 * 
 * requireToken -> <isTokenValid>
 */
const isTokenValid = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>=> {
  try {

    const token = (req as any).bearerToken;

    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    const userId = payload.userId as number;

    const loggedData: [any, FieldPacket[]] = await DB.query(
      'SELECT * FROM logged_users WHERE user_id = ? AND jwt_token = ? AND expires_at > NOW()',
      [userId, token]
    );

    // If no token found in the database, return 401
    if (!hasArrayData(loggedData[0])) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    next();

  } catch (error: any) {
    console.log('Error in middlewares/isTokenValid():', error);
    return res.status(401).json({ message: 'JWT token expired.' });
  }
}

export default isTokenValid;