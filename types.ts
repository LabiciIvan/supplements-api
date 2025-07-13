
interface createProductInterface {
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: number;
  createdBy: number;
};

interface updateProduct {
  id: number;
  message: string;
}

interface productInterface {
  id: number;
  quantity: number;
  price: number;
  vat_applied: string;
  vat_value: number;
  total_price: string;
}

interface deletedProductInterface {
  id: number;
  price?: number;
  deleted_at: string;
  quantity: number;
  category: string;
}

interface shippingInterface {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: number;
  userEmail: string;
}

interface createOrderInterface {
  products: productInterface[];
  user_id?: number | null;
  shipping: shippingInterface;
}

type orderStatusType = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface orderProductInterface {
  product_id: number;
  order_id: number;
  name: string;
  quantity: number;
  base_price: number;
  vat_applied: number;
  vat_value: number;
  total_price: number;
  product_total: number;
}


interface orderDetailInterface {
  address: string;
  city: string;
  country: string;
  postal_code: string;
  shipping_method: string;
  shipping_cost: number;
  order_total: number;
  total_with_shipping: number;
  order_status: orderStatusType;
  customer_name: string;
  vat: string;
  vatYearApplied: string;
  currency: string;
  currencySymbol: string;
  customer_email: string;
}

interface orderDataInterface {
  details: orderDetailInterface;
  products: orderProductInterface[];
}

interface productsFiltered {
  product_id: number;
  order_id: number;
  name: string;
  quantity: number;
  price_at_time: number;
  product_total: number;
}


interface detailsFiltered {
  order_id: number;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  shipping_method: string;
  shipping_cost: number;
  order_total: number;
  total_with_shipping: number;
  order_status: orderStatusType;
  customer_name: string;
  customer_email: string;
}

interface orderDataFiltered {
  order: {
    details: detailsFiltered;
    products: productsFiltered[];
  }
}

interface orderStatusInterface {
  id: number;
  status: orderStatusType;
}

interface whoIsUserInterface {
  userID: number;
  role: string;
  name: string;
}

interface categoryModelInterface {
  id: number, 
  name: string
}


interface invoiceResource {
  id: number;
  order_id: number;
  content: string;
}

type ResponseStatus = 'success' | 'fail' | 'error';

interface BaseResponse {
  status: ResponseStatus;
  message: string;
}

interface DataResponse<T> extends BaseResponse {
  data: T;
}

interface PaginationOptions {
  page: number,
  resultLimit: number
};

export {
  createProductInterface,
  whoIsUserInterface,
  categoryModelInterface,
  createOrderInterface,
  orderStatusInterface,
  orderStatusType,
  productInterface,
  orderDataInterface,
  orderProductInterface,
  orderDetailInterface,
  orderDataFiltered,
  detailsFiltered,
  productsFiltered,
  updateProduct,
  deletedProductInterface,
  invoiceResource,
  shippingInterface,
  BaseResponse,
  DataResponse,
  PaginationOptions
}