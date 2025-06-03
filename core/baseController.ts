import { Pool } from 'mysql2/promise';
import DB       from './database';

class BaseController {

  protected readonly fail: 'fail'         = 'fail';

  protected readonly success: 'success'   = 'success';

  protected readonly error: 'error'       = 'error';

  /**
   * The database connection pool, used to interact with the MySQL database.
   */
  protected db: Pool;

  constructor() {
    this.db = DB;
  }

}


export default BaseController;