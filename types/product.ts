import { TCategory } from './category';

export type TProduct = {
  _id: string;
  title: string;
  description: string;
  image: string;
  priceWithoutDiscount: number;
  priceWithDiscount: number;
  category: TCategory;
};
