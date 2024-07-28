import { Cart, Product } from '../../../src/models';
import {
  BulkPriceReductionRule,
  type BulkPriceReductionRuleConfig,
} from '../../../src/models/promotions/bulk-price-reduction-rule';

describe('Bulk price reduction rule', () => {
  let testCart: Cart;
  let curry: Product;
  let pizza: Product;
  let tshirt: Product;

  let products: Product[];
  let ruleConfig: BulkPriceReductionRuleConfig;

  beforeEach(() => {
    testCart = new Cart();
    curry = new Product('001', 'Curry Sauce', 1.95);
    pizza = new Product('002', 'Pizza', 5.99);
    tshirt = new Product('003', 'Men\'s T-Shirt', 25);
    products = [curry, pizza, pizza, pizza, tshirt];
    ruleConfig = {
      product: pizza,
      minQuantity: 3,
      discountPrice: 3.99,
    };

    for (const product of products) {
      testCart.add(product);
    }
  });

  it('should be applicable to products that fulfil the criteria', () => {
    const rule = new BulkPriceReductionRule(ruleConfig);

    expect(rule.isApplicable(testCart)).toBe(true);
  });

  it('shouldn\'t be applied to products that don\'t fulfil the criteria', () => {
    const rule = new BulkPriceReductionRule({...ruleConfig, minQuantity: 4});

    expect(rule.isApplicable(testCart)).toBe(false);
  });

  test('should apply discount correctly', () => {
    const rule = new BulkPriceReductionRule(ruleConfig);

    expect(pizza.price).toBe(5.99);
    expect(rule.apply(testCart)).toStrictEqual([6, testCart]);
    expect(pizza.price).toBe(ruleConfig.discountPrice);
  });

  it('should not apply discount when fewer than minQuantity are present', () => {
    const rule = new BulkPriceReductionRule(ruleConfig);
    const fewerProducts = [pizza, pizza];

    testCart.clear();
    for (const product of fewerProducts) {
      testCart.add(product);
    }

    expect(pizza.price).toBe(5.99);
    expect(rule.isApplicable(testCart)).toBe(false);
    expect(rule.apply(testCart)).toStrictEqual([0, testCart]);
    expect(pizza.price).toBe(5.99);
  });
});
