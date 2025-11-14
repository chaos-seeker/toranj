import { TProduct } from './product';
import { TUser } from './user';

export type TOrder = {
  id: string;
  products: TProduct[];
  user: TUser;
};
