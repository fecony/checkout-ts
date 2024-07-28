import { type Cart, type PromotionalRule } from '../models';

/**
 * Promotion engine class responsible for managing and applying promotional rules
 * to a shopping cart. It maintains a list of promotional rules and applies
 * them to the cart to calculate the total discount.
 */
export class PromotionEngine {
  private readonly rules: PromotionalRule[] = [];

  /**
   * Adds a new promotional rule to the engine.
   *
   * @param rule - The promotional rule to be added.
   */
  public addRule(rule: PromotionalRule): this {
    this.rules.push(rule);

    return this;
  }

  /**
   * Applies all applicable promotional rules to the given cart and calculates
   * the total discount.
   *
   * @param cart - The shopping cart to which promotions are applied.
   *
   * @returns The total discount amount.
   */
  public applyPromotions(cart: Cart): number {
    let discount = 0;

    for (const promotion of this.rules) {
      if (promotion.isApplicable(cart)) {
        const discountedPrice = promotion.apply(cart);

        discount += discountedPrice;
      }
    }

    return discount;
  }
}
