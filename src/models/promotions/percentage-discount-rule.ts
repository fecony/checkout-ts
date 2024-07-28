import { type Cart } from '../cart';
import { type Product } from '../product';
import { type PromotionalRule } from './promotional-rule';

export type PercentageDiscountRuleConfig = {
  threshold: number;
  discount: number;
};

/**
 * PercentageDiscountRule class implements a promotional rule that applies
 * a percentage discount to the total cart value if it exceeds a certain threshold.
 */
export class PercentageDiscountRule implements PromotionalRule {
  private readonly threshold: number;
  private readonly discount: number;

  constructor(config: PercentageDiscountRuleConfig) {
    this.threshold = config.threshold;
    this.discount = config.discount;
  }

  isApplicable(cart: Cart): boolean {
    const total = cart.getSubtotal();
    return total > this.threshold;
  }

  apply(cart: Cart): number {
    if (!this.isApplicable(cart)) {
      return 0;
    }

    return cart.getSubtotal() * (this.discount / 100);
  }
}
