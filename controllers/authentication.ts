import { FieldPacket, Pool, QueryError, QueryResult } from 'mysql2/promise';
import * as jose from 'jose';

import DB               from '../core/database';
import {
  hasArrayData,
  hashPassword 
}                       from '../services/functions';


class Auth {

  /*
   * The number of allowed login attempts before the user is blocked for 24 hours, as  a security
   * measure to prevent brute-force attacks.
   */
  private ALLOWED_LOGIN_ATTEMPTS: number = 5;


  /**
   * The database connection pool, used to interact with the MySQL database.
   */
  private db: Pool;


  constructor() {
    this.db = DB;
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
  private async checkUserExists(email: string): Promise<[{id: number; email: string; password_hash: string}]> {
    try {
      const [user]: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, email, password_hash FROM users WHERE email = ?',
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

      // Token is valid 2 hours after it is issued.
      const token = await new jose.SignJWT({userId: user[0].id})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      const now = Math.floor(Date.now() / 1000);

      const expiresAt = new Date((now + 2 * 60 * 60) * 1000);

      await this.db.query(
        'INSERT INTO logged_users (user_id, jwt_token, ip_address, user_agent, expires_at) VALUES (?, ?, ? , ?, ?)',
        [user[0].id, token, ipAddress, userAgent, expiresAt]
      );

      return {token: token};

    } catch (error: any) {
      console.log('Error in login method:', error);
      throw new Error(error.message || 'Internal server errora');
    }

  }


  async logout(): Promise<void> {
    // Implement logout logic here
  }


  async isAuthorised(): Promise<boolean> {
    // Implement auth check here
    return false;
  }


  async isLogged(token: string): Promise<boolean> {
    // Implement logged check here
    try {

      const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      const userId = payload.userId as number;

      const isLogged: [any, FieldPacket[]] = await this.db.query(
        'SELECT * FROM logged_users WHERE user_id = ? AND jwt_token = ? AND expires_at > NOW()',
        [userId, token]
      );

      console.log('isLogged:', isLogged);
      
      return true;

    } catch (error: any) {
      console.log('Error in isLogged method:', error);
      throw new Error(error.message || 'Internal server error');
    }
  }

  /**
   * Registers a new user in the database.
   *
   * @param username - The username of the user to register.
   * @param email    - The email address of the user to register.
   * @param password - The password of the user to register.
   *
   * @returns  - A promise that resolves to an object containing a message and the user ID if the 
   *             registration is successful, or an error message if the registration fails.
   */
  async register(username: string, email: string, password: string): Promise<{ message: string; userId?: number }> {
    try {

      const [result]: [any, FieldPacket[]] = await this.db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password]
      );

      return {
        message: 'User registered successfully.',
        userId: result.insertId,
      };

    } catch (error) {

      if ((error as QueryError).code === 'ER_DUP_ENTRY') {
        throw new Error('Username or email already exists');
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error('Internal server error' );
    }
  }


}

export default Auth;
