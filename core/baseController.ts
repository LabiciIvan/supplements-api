import { Pool } from 'mysql2/promise';
import DB       from './database';

class BaseController {

  /**
   * The database connection pool, used to interact with the MySQL database.
   */
  protected db: Pool;

  constructor() {
    this.db = DB;
  }

}


export default BaseController;