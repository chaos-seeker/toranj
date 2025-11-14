import { TOrder } from './order';

export type TUser = {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  orders: TOrder[];
};
