import { type Cart } from '../cart';

export type PromotionalRule = {
  /**
   * Check if cart items are applicable to rule
   *
   * @param cart
   */
  isApplicable(cart: Cart): boolean;

  /**
   * Calculate rule discount based on cart
   *
   * @param cart
   */
  apply(cart: Cart): number;
};
