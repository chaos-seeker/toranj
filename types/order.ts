import { TProduct } from './product';

export type TOrder = {
  _id: string;
  products: {
    productID: TProduct;
    quantity: number;
  }[];
  userID: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  };
  status: string;
  createdAt: Date;
};
