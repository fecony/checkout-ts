import { type Cart, type Product } from '../models';
import { type PromotionEngine } from './promotion-engine';

/**
 * Checkout class is responsible for managing the shopping cart
 * and calculating the total cost after applying promotional discounts.
 */
export class Checkout {
  constructor(
    private readonly cart: Cart,
    private readonly promotionEngine: PromotionEngine,
  ) {}

  /**
   * Add a product to the cart of the given quantity
   *
   * @param product - The product to add to the cart.
   * @param quantity - The amount of the product to add to the cart.
   */
  public scan(product: Product, quantity = 1): this {
    this.cart.add(product, quantity);

    return this;
  }

  /**
   * Clear all items from the cart.
   */
  public clear(): this {
    this.cart.clear();

    return this;
  }

  /**
   * Calculate the total cost by applying all promotional discounts using the promotion engine
   */
  public total(): number {
    const subtotal = this.cart.getSubtotal();
    const discount = this.promotionEngine.applyPromotions(this.cart);

    return subtotal - discount;
  }
}
