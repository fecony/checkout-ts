import {
  BulkPriceReductionRule, Cart, PercentageDiscountRule, Product,
} from '../../src/models';
import { Checkout } from '../../src/services/checkout';
import { PromotionEngine } from '../../src/services/promotion-engine';

describe('Checkout', () => {
  let cart: Cart;
  let promotionEngine: PromotionEngine;
  let checkout: Checkout;
  let productOne: Product;
  let productTwo: Product;
  let productThree: Product;

  beforeEach(() => {
    productOne = new Product('001', 'Curry Sauce', 1.95);
    productTwo = new Product('002', 'Pizza', 5.99);
    productThree = new Product('003', 'Men\'s T-Shirt', 25);
    cart = new Cart();
    promotionEngine = new PromotionEngine();
    checkout = new Checkout(cart, promotionEngine);
  });

  it('should add products to the cart using scan method', () => {
    checkout.scan(productOne);
    checkout.scan(productTwo, 2);

    expect(cart.getProductAmount(productOne)).toBe(1);
    expect(cart.getProductAmount(productTwo)).toBe(2);
  });

  it('should clear the cart using clear method', () => {
    checkout.scan(productOne);
    checkout.scan(productTwo, 2);
    checkout.clear();

    expect(cart.getItemCount()).toBe(0);
    expect(cart.getTotalCount()).toBe(0);
    expect(cart.getProductAmount(productOne)).toBe(0);
    expect(cart.getProductAmount(productTwo)).toBe(0);
  });

  it('should calculate total without promotions', () => {
    checkout.scan(productOne);
    checkout.scan(productTwo, 2);

    const total = checkout.total();
    expect(total).toBeCloseTo(13.93, 2);
  });

  it('should not apply any promotion if conditions are not met', () => {
    checkout.scan(productOne);
    checkout.scan(productTwo);

    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    }));

    const total = checkout.total();
    expect(total).toBeCloseTo(7.94, 2);
    expect(promotionEngine.applyPromotions(cart)).toBe(0);
  });

  it('should apply percentage discount promotion correctly', () => {
    checkout.scan(productThree);
    checkout.scan(productTwo, 2);

    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    }));

    const total = checkout.total();
    expect(total).toBeCloseTo(33.282, 2);
  });

  it('should apply bulk price reduction promotion correctly', () => {
    checkout.scan(productTwo, 3);

    promotionEngine.addRule(new BulkPriceReductionRule({
      product: productTwo,
      minQuantity: 2,
      discountPrice: 3.99,
    }));

    const total = checkout.total();
    expect(total).toBeCloseTo(11.97, 2);
  });

  it('should apply multiple promotions correctly', () => {
    checkout.scan(productThree);
    checkout.scan(productTwo, 2);

    expect(checkout.total()).toBeCloseTo(36.98, 2);

    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    })).addRule(new BulkPriceReductionRule({
      product: productTwo,
      minQuantity: 2,
      discountPrice: 3.99,
    }));

    expect(checkout.total()).toBeCloseTo(29.28, 2);
  });
});
