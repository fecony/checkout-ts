import {
  Cart, PercentageDiscountRule, type PercentageDiscountRuleConfig, Product,
} from '../../../src/models';

describe('Percentage discount rule', () => {
  let cart: Cart;
  let productOne: Product;
  let productTwo: Product;

  beforeEach(() => {
    productOne = new Product('001', 'Product 1', 15);
    productTwo = new Product('002', 'Product 2', 20);
    cart = new Cart();
  });

  it('should apply discount correctly when subtotal exceeds threshold', () => {
    cart.add(productOne, 2);
    cart.add(productTwo, 1);

    const config: PercentageDiscountRuleConfig = {
      threshold: 40,
      discount: 10,
    };

    const rule = new PercentageDiscountRule(config);

    expect(cart.getSubtotal()).toBe(50);

    expect(rule.isApplicable(cart)).toBeTruthy();
    expect(rule.apply(cart)).toBe(5);// 50 * 0.10
    expect(cart.getSubtotal()).toBe(50);
  });

  it('should not apply discount when subtotal does not exceed threshold', () => {
    cart.add(productOne);
    cart.add(productTwo);

    const config: PercentageDiscountRuleConfig = {
      threshold: 40,
      discount: 10,
    };

    const rule = new PercentageDiscountRule(config);

    expect(cart.getSubtotal()).toBe(35);
    expect(rule.apply(cart)).toBe(0);
    expect(cart.getSubtotal()).toBe(35);
  });

  it('should not apply discount when subtotal is exactly at threshold', () => {
    cart.add(productTwo, 2);

    const config: PercentageDiscountRuleConfig = {
      threshold: 40,
      discount: 10,
    };

    const rule = new PercentageDiscountRule(config);

    expect(rule.isApplicable(cart)).toBeFalsy();
    expect(rule.apply(cart)).toBe(0);
    expect(cart.getSubtotal()).toBe(40);
  });

  it('should apply correct discount for different thresholds', () => {
    cart.add(productOne, 3);

    const config: PercentageDiscountRuleConfig = {
      threshold: 30,
      discount: 20,
    };

    const rule = new PercentageDiscountRule(config);

    expect(rule.apply(cart)).toBe(9); // 45 * 0.20
    expect(cart.getSubtotal()).toBe(45);
  });
});
