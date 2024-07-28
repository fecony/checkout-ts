import { type Cart } from '../cart';
import { type Product } from '../product';
import { type PromotionalRule } from './promotional-rule';

export type BulkPriceReductionRuleConfig = {
  product: Product;
  minQuantity: number;
  discountPrice: number;
};

/**
 * BulkPriceReductionRule class implements a promotional rule that applies
 * a discount to the price of a product if a minimum quantity is purchased.
 */
export class BulkPriceReductionRule implements PromotionalRule {
  private readonly product: Product;
  private readonly minQuantity: number;
  private readonly discountPrice: number;

  constructor(config: BulkPriceReductionRuleConfig) {
    this.product = config.product;
    this.minQuantity = config.minQuantity;
    this.discountPrice = config.discountPrice;
  }

  isApplicable(cart: Cart): boolean {
    return cart.getProductAmount(this.product) >= this.minQuantity;
  }

  apply(cart: Cart): number {
    if (!this.isApplicable(cart)) {
      return 0;
    }

    const productPrice = this.product.price;

    cart.updateProductPrice(this.product, this.discountPrice);

    return (productPrice - this.discountPrice) * cart.getProductAmount(this.product);
  }
}
