import { type Cart } from '../cart';
import { type Product } from '../product';
import { type PromotionalRule } from './promotional-rule';

export type BuyOneGetOne = {
  product: Product;
};

/**
 * BuyOneGetOneRule class implements a promotional rule that provides a free product
 * for every product of the same type purchased.
 */
export class BuyOneGetOneRule implements PromotionalRule {
  private readonly product: Product;

  constructor(config: BuyOneGetOne) {
    this.product = config.product;
  }

  isApplicable(cart: Cart): boolean {
    return cart.hasProduct(this.product);
  }

  apply(cart: Cart): number {
    if (!this.isApplicable(cart)) {
      return 0;
    }

    const amount = cart.getProductAmount(this.product);
    const freeItems = Math.floor(amount / 2);
    const discountValue = this.product.price * freeItems;

    return discountValue;
  }
}
