import { type Product } from '../product';
import { type PromotionalRule } from './promotional-rule';

export type BulkPriceReductionRuleConfig = {
  productCode: string;
  minQuantity: number;
  reducedPrice: number;
};

export class BulkPriceReductionRule implements PromotionalRule {
  private readonly productCode: string;
  private readonly minQuantity: number;
  private readonly reducedPrice: number;

  constructor(config: BulkPriceReductionRuleConfig) {
    this.productCode = config.productCode;
    this.minQuantity = config.minQuantity;
    this.reducedPrice = config.reducedPrice;
  }

  isApplicable(products: Product[]): boolean {
    const applicableProducts = this.getApplicableProducts(products);
    return applicableProducts.length >= this.minQuantity;
  }

  apply(products: Product[]): number {
    if (!this.isApplicable(products)) {
      return 0;
    }

    const applicableProducts = this.getApplicableProducts(products);
    return this.reducedPrice * applicableProducts.length;
  }

  protected getApplicableProducts(products: Product[]): Product[] {
    return products.filter(product => product.code === this.productCode);
  }
}
