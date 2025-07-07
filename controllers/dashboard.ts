import { FieldPacket }                      from 'mysql2';
import BaseController                       from '../core/baseController';
import { hasArrayData }                     from '../services/functions';
import { BaseResponse, DataResponse }       from '../types';

type TopOrderedProduct = {
  product_id: number;
  orderedQuantity: number;
  productName: string;
};

/**
 * Dashboard class.
 *
 * Manages dashboard details based on the products, orders, users and others.
 *
 * @class Dashboard
 */
class Dashboard extends BaseController {

  constructor() {
    super();
  }

  public async getMostOrderedProducts(limit: number = 10): Promise<BaseResponse|DataResponse<TopOrderedProduct[]>> {
    try {

      const data:[any, FieldPacket[]] = await this.db.query(
        `SELECT
          op.product_id AS product_id,
          COUNT(op.product_id) AS orderedQuantity,
          p.name AS productName,
          c.id AS categoryId,
          c.name AS categoryName
        FROM orders_products AS op
        INNER JOIN products AS p ON op.product_id = p.id
        INNER JOIN categories AS c ON p.category_id = c.id
        GROUP BY op.product_id
        ORDER BY orderedQuantity DESC LIMIT ?`,
        [limit]
      );

      if (!hasArrayData(data[0])) {
        return {
          status: this.fail,
          message: 'No most ordered products list available'
        }
      }

      const mostOrderedProducts: TopOrderedProduct[] = data[0].map((item: any) => ({product_id: item.product_id, orderedQuantity: item.orderedQuantity, productName: item.productName, categoryName: item.categoryName, categoryId: item.categoryId}));

      return {
        status: this.success,
        message: 'Successfully fetched most ordered products list',
        data: mostOrderedProducts
      }

    } catch (error: any) {
      console.log('Error in controllers/dashboard/getMostOrderedProducts(): ', error);
      throw error;
    }
  }


  public async calculateTotalRevenue(year: string, month?: string, day?: string): Promise<DataResponse<{total: string}>> {
    try {

      let dateCondition = "DATE_FORMAT(o.created_at, '%Y') = ?";

      if (month) {
        dateCondition += " AND DATE_FORMAT(o.created_at, '%m') = ?";
      }

      if (day) {
        dateCondition += " AND DATE_FORMAT(o.created_at, '%d') = ?";
      }

      const [total]: [any, FieldPacket[]] = await this.db.query(
        `SELECT IF(SUM(o.total) IS NULL, 0, SUM(o.total)) AS totalRevenue
         FROM orders AS o
         INNER JOIN order_status AS os ON o.status_id = os.id
         WHERE os.status = 'delivered' AND ${dateCondition}`,
         [year, month, day]
      );

      return {
        status: this.success,
        message: 'Total revenue success',
        data: {
          total: total[0].totalRevenue
        },
      }

    } catch (error: any) {
      console.log('Error in controllers/dashboard/getDashboard(): ', error);
      throw error;
    }
  }

  public async revenueAndPercentageDifference(): Promise<DataResponse<{revenuePercentageDifference: string}>> {
    try {

      const [revenuePercentage]: [any, FieldPacket[]] = await this.db.query(
        `SELECT 
          DATE_FORMAT(o.created_at, '%Y-%m') AS month,
          SUM(o.total) AS totalRevenue,
          CONCAT(
            ROUND(
              (SUM(o.total) - LAG(SUM(o.total)) OVER (ORDER BY DATE_FORMAT(o.created_at, '%Y-%m'))) 
              / NULLIF(LAG(SUM(o.total)) OVER (ORDER BY DATE_FORMAT(o.created_at, '%Y-%m')), 0) * 100,
              2
            ),
          '%') AS growthPercentage
        FROM orders AS o
        INNER JOIN order_status AS os ON o.status_id = os.id
        WHERE os.status = 'delivered'
        GROUP BY month
        ORDER BY month`);

      return {
        status: this.success,
        message: 'Revenue and percentage difference',
        data: {
          revenuePercentageDifference: revenuePercentage
        }
      }

    } catch (error: any) {
      console.log('Error in controllers/dashboard/getDashboard(): ', error);
      throw error;
    }
  }


  public async getDashboard(): Promise<DataResponse<{mostOrderdProducts: TopOrderedProduct[] | BaseResponse}>> {
    try {

      const mostOrderedProducts = await this.getMostOrderedProducts();

      return {
        status: this.success,
        message: 'Dashboard fetched successfully',
        data: {
          mostOrderdProducts: mostOrderedProducts
        }
      }

    } catch (error: any) {
      console.log('Error in controllers/dashboard/getDashboard(): ', error);
      throw error;
    }
  }
  
}


export default Dashboard;

