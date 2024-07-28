import { type Cart } from '../cart';

export type PromotionalRule = {
  isApplicable(cart: Cart): boolean;
  apply(cart: Cart): [number, Cart];
};
