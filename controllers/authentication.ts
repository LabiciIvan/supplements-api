import {
  FieldPacket,
  QueryError
}                     from 'mysql2/promise';
import {
  hasArrayData,
  hashPassword 
}                     from '../services/functions';
import * as jose      from 'jose';
import BaseController from '../core/baseController';



/**
 * Authentication class.
 * 
 * This class handles user authentication, including login, logout, registration and delete.
 *
 * It interacts with the database to check user credentials, login attempts, and manage user
 * registration.
 *
 * It also generates and verifies JWT tokens for user sessions.
 *
 * @class Auth
 */
class Auth extends BaseController {


  /*
   * The number of allowed login attempts before the user is blocked for 24 hours, as  a security
   * measure to prevent brute-force attacks.
   */
  private ALLOWED_LOGIN_ATTEMPTS: number = 5;


  /**
   * The number of JWT login token duration (3 hours).
   */
  private DURATION_LOGIN_TOKEN: string = '3 hour';


  /**
   * Password reset limit, if exceeded the application won't generate password reset tokens.
   */
  private DAILY_PASSWORD_RESET_LIMIT: number = 4;


  /**
   * The password reset token duration (10 min).
   */
  private PASSWORD_RESET_TOKEN_LIFESPAN: string = '10 min';


  constructor() {
    super();
  }


  /**
   * This method is used to prevent multiple login tokens for the same user.
   *
   * It checks if there are any existing login tokens for the user with the given email address and
   * sequentially logs out any existing tokens by calling the logout method for each token found.
   *
   * @param email - The email address of the user to check for existing login tokens.
   * @returns 
   */
  private async preventMultipleLoginToken(email: string): Promise<void> {
    try {
      const loginTokens: [any, FieldPacket[]] = await this.db.query(
        'SELECT lu.jwt_token AS token FROM logged_users AS lu INNER JOIN users AS u ON lu.user_id = u.id WHERE u.email = ? AND lu.expires_at > NOW()',
        [email]
      );

      if (!hasArrayData(loginTokens[0])) return;

      loginTokens[0].map( async (data: {token: string}) => {
        await this.logout(data['token']);
      });

      return;

    } catch (error: any) {
      console.log('Error in /controllers/authentication.ts/preventMultipleLoginToken(): ', error);
      throw new Error(error.message || 'Internal server error');
    }
  }


  /**
   * Checks if a user exists in the database by their email address.
   *
   * If the user exists, it returns their ID, email, and password hash otherwise it will return an
   * empty array.
   *
   * @param email - The email address of the user to check.
   *
   * @returns  - A promise that resolves to an array containing the user's ID, email, and password
   *             hash if the user exists, or an empty array if the user does not exist.
   */
  public async checkUserExists(email: string): Promise<[{id: number; email: string; password_hash: string}]> {
    try {
      const [user]: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, email, password_hash FROM users WHERE email = ? AND deleted = 0',
        [email]
      );

      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Internal server error');
    }
  }


  /**
   * Logs in a user by checking their email and password against the database.
   *
   * If the login is successful, it returns a token. If the login fails, it logs the attempt and
   * returns an error message.
   *
   * If the user has exceeded the allowed login attempts, it returns an error message.
   *
   * @param email     - The email address of the user trying to log in.
   * @param password  - The password of the user trying to log in.
   * @param ipAddress - The IP address of the user trying to log in.
   * @param userAgent - The user agent of the user's device trying to log in.
   *
   * @returns - A promise that resolves to an object containing a token if the login is successful,
   *            or an error message if the login fails or the user has exceeded the allowed attempts.
   */
  async login(email: string, password: string, ipAddress: string, userAgent: string): Promise<{token?: string} | {message: string}> {
    try {
      const user = await this.checkUserExists(email);

      await this.preventMultipleLoginToken(email);

      if (!hasArrayData(user)) {
        return {message: 'User not found.'};
      }

      const logginAttempts: [any, FieldPacket[]] = await this.db.query(
        'SELECT COUNT(*) AS attempted FROM login_attempts WHERE email = ? AND success = FALSE AND attempted_at > (NOW() - INTERVAL 1 DAY)',
        [email],
      );

      // Check if the user has exceeded the allowed login attempts
      if (logginAttempts[0][0].attempted >= this.ALLOWED_LOGIN_ATTEMPTS) {
        return {message: 'Too many login attempts, try again in 24 hours or contact support team.'};
      }

      const tempHashPassowrd = hashPassword(password);

      // If password don't match, log the attempt and return an error message.
      if (user[0].password_hash !== tempHashPassowrd) {
        await this.db.query(
          'INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success) VALUES (?, ?, ?, ?, FALSE)',
          [user[0].id, user[0].email, ipAddress, userAgent]
        );

        return {message: 'Invalid password.'};
      }

      // If password matches, log the attempt and return a token.
      await this.db.query(
        'INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success) VALUES (?, ?, ?, ?, TRUE)',
        [user[0].id, user[0].email, ipAddress, userAgent]
      );

      // Token is valid 3 hours after it is issued.
      const token = await new jose.SignJWT({userId: user[0].id})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(this.DURATION_LOGIN_TOKEN)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      await this.db.query(
        `INSERT INTO logged_users (user_id, jwt_token, ip_address, user_agent, expires_at) VALUES (?, ?, ? , ?, (NOW() + INTERVAL ${this.DURATION_LOGIN_TOKEN}))`,
        [user[0].id, token, ipAddress, userAgent]
      );

      return {token: token};

    } catch (error: any) {
      console.log('Error in /controllers/authentication.ts/login: ', error);
      throw new Error(error.message || 'Internal server errora');
    }

  }


}


export default Auth;
