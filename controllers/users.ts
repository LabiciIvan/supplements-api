import { FieldPacket }      from 'mysql2';
import BaseController       from '../core/baseController';
import { hasArrayData }     from '../services/functions';
import {
  BaseResponse,
  DataResponse,
  PaginationOptions
}                           from '../types';
import * as jose            from 'jose';


class User extends BaseController {

  /**
   * The password reset token duration (10 min).
   */
  private PASSWORD_RESET_TOKEN_LIFESPAN: string = '10 min';


  constructor() {
    super();
  }


  public async getUsers(deleted: boolean, options: PaginationOptions): Promise<BaseResponse | DataResponse<{users: any[]}>> {

    const offset = (options.page - 1) * options.resultLimit;

    try {
      const [users]: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          id,
          DATE(created_at) as registerd_date,
          username,
          email
          FROM users
          WHERE deleted = ? LIMIT ? OFFSET ?`,
        [deleted, options.resultLimit, offset]
      );

      if (!hasArrayData(users)) {
        return {
          status: this.fail,
          message: 'No users results.'
        }
      }

      return {
        status: this.success,
        message: 'Users fetched successfully',
        data: {
          users: users
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/users.ts/getUsers(): ', error);
      throw new Error(error.message || 'Internal server error');
    }
  }


  public async getUsersByRole(role: string, deleted: boolean, options: PaginationOptions): Promise<BaseResponse | DataResponse<{users: any[]}>> {

    const offset = (options.page - 1) * options.resultLimit;

    try {
      const [users]: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          u.id,
          DATE(u.created_at) as registerd_date,
          u.username,
          u.email,
          r.role
          FROM users AS u INNER JOIN roles AS r ON u.id = r.user_id
          WHERE u.deleted = ? AND r.role = ? LIMIT ? OFFSET ?`,
        [deleted, role, options.resultLimit, offset]
      );

      if (!hasArrayData(users)) {
        return {
          status: this.fail,
          message: 'No users results.'
        }
      }

      return {
        status: this.success,
        message: 'Users fetched successfully',
        data: {
          users: users
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/users.ts/getUsers(): ', error);
      throw new Error(error.message || 'Internal server error');
    }
  }


  public async updateUserRole(role: string, user_id: number): Promise<BaseResponse> {

    try {
      const [users]: [any, FieldPacket[]] = await this.db.query(
        `UPDATE roles SET role = ? WHERE user_id = ?`,
        [role, user_id]
      );

      return {
        status: this.success,
        message: 'User role updated successfully.',
      }

    } catch (error: any) {
      console.log('Error in /controllers/users.ts/getUsers(): ', error);
      throw new Error(error.message || 'Internal server error');
    }
  }



  public async generatePasswordResetForUser(email: string): Promise<{token: string}> {
    try {

      const passwordResetToken = await new jose.SignJWT({userEmail: email})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(this.PASSWORD_RESET_TOKEN_LIFESPAN)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      // Invalidate any valid password reset tokens for today for this user.
      await this.db.query(
        `UPDATE password_reset SET valid = 'N' WHERE DATE(created_at) = CURRENT_DATE AND user_id = (SELECT id FROM users WHERE email = ?)`,
        [email]
      );


      // Insert the password reset token into the database.
      await this.db.query(
        `INSERT INTO password_reset (user_id, token) VALUES
        ((SELECT id FROM users WHERE email = ?), ?)`,
        [email, passwordResetToken]
      );

      return {token: passwordResetToken};

    } catch (error: any) {
      console.log('Error in /controllers/authentication.ts/generatePasswordResetToken(): ', error);
      throw new Error('Internal server error');
    }

  }


  public async deleteUserAccount(email: string): Promise<{message: string}> {
    try {

      await this.db.query(
        'UPDATE users SET deleted = 1 WHERE email = ?',
        [email]
      );

      return {
        message: 'User deleted successfully',
      }

    } catch (error: any) {
      console.log('Error in /controllers/authentication.ts/delete(): ', error);
      throw new Error('Internal server error');
    }
  }


  public async getUserDetails(email: string): Promise<BaseResponse | DataResponse<{details: any[]}>> {
    try {

      const [userDetails]: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          u.email AS email,
          u.username AS username,
          la.ip_address AS ipAddress,
          la.user_agent AS userAgent,
          la.success AS success,
          la.attempted_at AS attemptedAt,
          pr.created_at AS passwordResetDate
          FROM users AS u
          LEFT JOIN login_attempts AS la ON u.id = la.user_id
          LEFT JOIN password_reset AS pr ON u.id = pr.user_id
          WHERE u.email = ?
          ORDER BY la.attempted_at DESC
        `,
        [email]
      );

      if (!hasArrayData(userDetails)) {
        return {
          status: this.fail,
          message: 'No details found.',
        }
      }

      return {
        status: this.success,
        message: 'User deleted successfully',
        data: {
          details: userDetails
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/authentication.ts/delete(): ', error);
      throw new Error('Internal server error');
    }
  }

}

export default User;

