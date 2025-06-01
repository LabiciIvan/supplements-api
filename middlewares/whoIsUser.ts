import DB from '../core/database';
import { FieldPacket } from 'mysql2';
import { whoIsUserInterface } from '../types';



const whoIsUser = async (token: string): Promise<boolean | whoIsUserInterface> => {
  try {

    const [user]: [any, FieldPacket[]] = await DB.query(
      `SELECT
        u.id as userID,
        u.username as name,
        r.role as role
      FROM users AS u
      INNER JOIN logged_users AS lu ON u.id = lu.user_id
      INNER JOIN roles AS r ON r.user_id = u.id
      WHERE lu.jwt_token = ?
      `,
      [token]
    );

    const userData: whoIsUserInterface = {...user[0]}

    if (!user[0]) return false;

    return userData;

  } catch (error: any) {
    console.log('Error in /middlewares/whoIsUser.tx: ', error);
    throw new Error(error.message);
  }
}

export default whoIsUser;