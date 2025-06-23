import {
  FieldPacket
}                         from 'mysql2/promise';
import {
  BaseResponse,
  DataResponse,
}                         from '../types';
import BaseController     from '../core/baseController';
import { hasArrayData } from '../services/functions';

/**
 * Invoice class.
 *
 * Creates invoice based on the products placed.
 *
 * @class Invoice
 */
class Invoice extends BaseController{


  constructor() {
    super();
  }


  private generateInvoiceHTML(orderData: any[]): string {
    if (orderData.length === 0) return '<p>No order data available.</p>';

    // Extract general order/shipping details from the first row
    const {
      orderId,
      orderTotal,
      orderDate,
      shippingMethod,
      shippingCost,
      shippingAddress,
      shippingCity,
      shippingCountry,
      shippingPostalCode,
      totalWithShipping,
      userEmail,
      currencySymbol,
      currency,
      country
    } = orderData[0];

    let boilerPlate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice Email</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
          <tr>
            <td align="center">
              <table width="700" cellpadding="20" cellspacing="0" border="0" style="background-color:#ffffff; border-collapse:collapse;">
                {{ HEADER }}
                {{ COMPANY_DETAILS }}
                {{ SHIPPING_DETAILS }}
                {{ PRODUCTS }}
                {{ SUMMARY }}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

    const HEADER = `
      <tr>
        <td align="center" style="font-size:20px; font-weight:bold;">
          Supplements - API Store - Invoice, order #${orderId}
        </td>
      </tr>`;

    const COMPANY_DETAILS = `
      <tr>
        <td>
          <table width="100%" cellpadding="5" cellspacing="0" border="0">
            <tr>
              <td>Date:</td>
              <td>${orderDate}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${userEmail}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>Company Email:</td>
              <td>support@apistore.com</td>
            </tr>
            <tr>
              <td>Company Website:</td>
              <td>www.supplementsAPI.com</td>
            </tr>
            <tr>
              <td>Currency:</td>
              <td>${currency}</td>
            </tr>
            <tr>
              <td>Currency Symbol:</td>
              <td>${currencySymbol + ' ' +  '( ' + country +  ' )'}</td>
            </tr>
          </table>
        </td>
      </tr>
    `;

    const SHIPPING_DETAILS = `
      <tr>
        <td>
          <table width="100%" cellpadding="5" cellspacing="0" border="1" style="border-collapse:collapse;">
            <tr>
              <th colspan="2" align="left" style="background-color:#eeeeee;">Shipping Details</th>
            </tr>
            <tr>
              <td>Address</td>
              <td>${shippingAddress}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>${shippingCity}</td>
            </tr>
            <tr>
              <td>Country</td>
              <td>${shippingCountry}</td>
            </tr>
            <tr>
              <td>Postal Code</td>
              <td>${shippingPostalCode}</td>
            </tr>
            <tr>
              <td>Shipping Method</td>
              <td>${shippingMethod}</td>
            </tr>
            <tr>
              <td>Shipping Cost</td>
              <td>${shippingCost  + ' ' + currencySymbol}</td>
            </tr>
          </table>
        </td>
      </tr> `;

    let PRODUCTS = `
      <tr>
        <td>
          <table width="100%" cellpadding="5" cellspacing="0" border="1" style="border-collapse:collapse;">
            <tr style="background-color:#eeeeee;">
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>VAT %</th>
              <th>VAT Cost</th>
              <th>Total (no VAT)</th>
              <th>Total (with VAT)</th>
            </tr>`;

    // Loop through all products
    for (const row of orderData) {
      PRODUCTS += `
        <tr>
          <td width="40%">${row.productName}</td>
          <td width="10%" align="center">${row.productBoughtQuantity}</td>
          <td width="22%" align="center">${row.ProductBasePrice + ' ' + currencySymbol}</td>
          <td width="22%" align="center">${row.vatPercentage}%</td>
          <td width="22%" align="center">${row.vatAppliedCost + ' ' + currencySymbol}</td>
          <td width="22%" align="center">${row.totalPriceNoVAT + ' ' + currencySymbol}</td>
          <td width="22%" align="center">${row.totalPrice + ' ' + currencySymbol}</td>
        </tr>
      `;
    };

    PRODUCTS += `
    </table>
        </td>
      </tr>`;

    const SUMMARY = `
      <tr>
        <td>
          <table width="100%" cellpadding="5" cellspacing="0" border="1" style="border-collapse:collapse;">
            <tr style="background-color:#eeeeee;">
              <th colspan="2" align="left">Summary</th>
            </tr>
            <tr>
              <td>Total Products (with VAT)</td>
              <td>${orderTotal + ' ' + currencySymbol}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>${shippingCost + ' ' + currencySymbol}</td>
            </tr>
            <tr>
              <td><strong>Grand Total</strong></td>
              <td><strong>${totalWithShipping + ' ' + currencySymbol}</strong></td>
            </tr>
          </table>
        </td>
      </tr>
    `;

    boilerPlate = boilerPlate.replace('{{ HEADER }}', HEADER);
    boilerPlate = boilerPlate.replace('{{ COMPANY_DETAILS }}', COMPANY_DETAILS);
    boilerPlate = boilerPlate.replace('{{ SHIPPING_DETAILS }}', SHIPPING_DETAILS);
    boilerPlate = boilerPlate.replace('{{ PRODUCTS }}', PRODUCTS);
    boilerPlate = boilerPlate.replace('{{ SUMMARY }}', SUMMARY);

    return boilerPlate;
  }


  async createInvoice(orderId: number): Promise<DataResponse<{id: number}>> {
    try {
      console.log('orderId', orderId);
      const orderData: [any, FieldPacket[]] = await this.db.query(
        `SELECT
          o.id AS orderId,
          o.total AS orderTotal,
          o.user_email AS userEmail,
          DATE_FORMAT(o.created_at, '%Y-%m-%d') AS orderDate,
          s.shipping_method AS shippingMethod,
          s.shipping_cost AS shippingCost,
          s.address AS shippingAddress,
          s.city AS shippingCity,
          s.country AS shippingCountry,
          s.postal_code AS shippingPostalCode,
          (s.shipping_cost + o.total) AS totalWithShipping,
          p.id AS productId,
          p.name AS productName,
          p.price AS productPrice,
          op.quantity AS productBoughtQuantity,
          op.base_price AS ProductBasePrice,
          op.vat_applied AS vatAppliedCost,
          op.vat_value AS vatPercentage,
          (op.quantity * op.base_price) AS totalPriceNoVAT,
          op.total_price AS totalPrice,
          cv.country AS country,
          cv.currency AS currency,
          cv.currency_symbol AS currencySymbol
          FROM orders AS o 
          INNER JOIN orders_products AS op ON o.id = op.order_id
          INNER JOIN products AS p ON op.product_id = p.id
          INNER JOIN shipping AS s ON o.shipping_id = s.id
          INNER JOIN countries_vat AS cv ON o.country_vat_id = cv.id
          INNER JOIN shipping_methods AS smthd ON s.shipping_method = smthd.name
          WHERE o.id = ?
        `,
        [orderId]
      );

      const invoiceHTML = this.generateInvoiceHTML(orderData[0]);

      const insertInvoiceResult: [any, FieldPacket[]] = await this.db.query(
        'INSERT INTO invoices (order_id, content) VALUE (? , ?)',
        [orderId, invoiceHTML]
      );

      return {
        status: this.success,
        message: 'Invoice created successfully.',
        data: {
          id: insertInvoiceResult[0].insertId,
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/invoice.ts/createInvoie(): ', error)
      throw new Error(error);
    }
  }


  async getInvoice(invoiceId: number): Promise<DataResponse<{id: number, content: string, order_id: number}>> {
    try {
      const [invoiceData]: [any, FieldPacket[]] = await this.db.query(
        'SELECT * FROM invoices WHERE id = ?',
        [invoiceId]
      );

      return {
        status: this.success,
        message: 'Invoice fetched successfully.',
        data: {
          id: invoiceData[0].id,
          content: invoiceData[0].content,
          order_id: invoiceData[0].order_id,
        }
      }

    } catch (error: any) {
      console.log('Error in /controllers/invoice.ts/getInvoice(): ', error)
      throw new Error(error);
    }
  }


  async getAllInvoices(): Promise<BaseResponse | DataResponse<{id: number, created_at: string, content: string}[]>> {
    try {
      const [invoiceData]: [any, FieldPacket[]] = await this.db.query(
        'SELECT id, created_at, content FROM invoices',
      );

      if (!hasArrayData(invoiceData)) {
        return {
          status: this.fail,
          message: 'No invoices currently generated.',
        }
      }

      return {
        status: this.success,
        message: 'Invoice fetched successfully.',
        data: invoiceData
      }

    } catch (error: any) {
      console.log('Error in /controllers/invoice.ts/getInvoice(): ', error)
      throw new Error(error);
    }
  }

}

export default Invoice;