import { NextFunction, Request, Response } from 'express';

import DB from '../core/database';
import { FieldPacket } from 'mysql2';
import { hasArrayData } from '../services/functions';

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {

    const token = (req as any).bearerToken;

    const isUserAdmin: [any, FieldPacket[]] = await DB.query(
      'SELECT r.role AS role FROM roles AS r INNER JOIN logged_users AS lu ON r.user_id = lu.user_id INNER JOIN users AS u ON lu.user_id = u.id WHERE lu.jwt_token = ?',
      [token]
    );


    // This is a security measure to prevent unauthorized access to admin routes.
    if (!hasArrayData(isUserAdmin[0]) || isUserAdmin[0][0]['role'] !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not have admin privileges.' });
    }

    next();

  } catch (error: any) {
    console.log('Error in middlewares/isAdmin.ts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default isAdmin;