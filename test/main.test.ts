import {
  BulkPriceReductionRule, Cart, PercentageDiscountRule, Product,
} from '../src/models';
import { Checkout } from '../src/services/checkout';
import { PromotionEngine } from '../src/services/promotion-engine';

describe('Basic test cases', () => {
  let cart: Cart;
  let promotionEngine: PromotionEngine;
  let checkout: Checkout;

  const curry = new Product('001', 'Curry Sauce', 1.95);
  const pizza = new Product('002', 'Pizza', 5.99);
  const tshirt = new Product('003', 'Men\'s T-Shirt', 25);

  beforeEach(() => {
    promotionEngine = new PromotionEngine();

    promotionEngine.addRule(
      new PercentageDiscountRule({
        threshold: 30,
        discount: 10,
      }),
    ).addRule(
      new BulkPriceReductionRule({
        product: pizza,
        minQuantity: 2,
        discountPrice: 3.99,
      }),
    );

    checkout = new Checkout(new Cart(), promotionEngine);
  });

  test.each([
    { label: 'Test 1', products: [curry, pizza, tshirt], expected: 29.65 },
    { label: 'Test 2', products: [pizza, curry, pizza], expected: 9.93 },
    { label: 'Test 3', products: [pizza, curry, pizza, tshirt], expected: 31.44 },
  ])('$label should have total of: $expected', ({ products, expected, label }) => {
    for (const product of products) {
      checkout.scan(product);
    }

    expect(checkout.total()).toBeCloseTo(expected, 2);
  });
});
