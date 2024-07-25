import { type Product } from '../product';

export type PromotionalRule = {
  isApplicable(products: Product[]): boolean;
  apply(products: Product[]): number;
};
