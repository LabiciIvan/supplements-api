import DB         from '../core/database';
import {
  Request,
  Response,
  NextFunction
}                 from 'express';
import {
  hasArrayData
}                 from '../services/functions';
import {
  FieldPacket
}                 from 'mysql2';


/**
 * Restrict order view.
 *
 * Allows only user to view their own orders and admin user to view anyone order.
 *
 * It's expecting an orderId parameter in the url.
 */
const restricViewOrder = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {

    const { orderId } = req.params;

    if (isNaN(Number(orderId))) {
      res.status(400).json({
        message: "The 'orderId' parameter must be a numeric value."
      });
      return;
    }

    const token = (req as any).bearerToken;

    const userFetched: [any, FieldPacket[]] = await DB.query(
      `SELECT
        u.id AS requesting_user_id,
        r.role,
        o.id AS order_id,
        o.user_id AS user_order
      FROM users AS u
      INNER JOIN roles AS r ON u.id = r.user_id
      INNER JOIN logged_users AS lu ON u.id = lu.user_id
      LEFT JOIN orders AS o ON o.id = ?
      WHERE lu.jwt_token = ? AND (o.id IS NOT NULL OR r.role = 'admin')
      `,
      [orderId, token]
    );

    console.log('restirct order', userFetched);
    if (!hasArrayData(userFetched[0]) || (userFetched[0][0].order_id == null && userFetched[0][0].role !== 'admin')) {
      return res.status(404).json({
        message: 'Order could not be found.'
      });
    }

    const {requesting_user_id,user_order, role} = userFetched[0][0];

    if (requesting_user_id !== user_order && role !== 'admin') {
      return res.status(401).json({
        message: 'You are not authorized to perform this action or access this resource.'
      });
    }

    next();

  } catch (error: any) {
    console.log('Error in middlewares/restricViewOrder(): ', error);
    return res.status(401).json({
      message: 'You are not authorized to perform this action or access this resource.'
    });
  }
}

export default restricViewOrder;