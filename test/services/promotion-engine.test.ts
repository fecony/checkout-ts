import {
  Cart,
  Product,
  BulkPriceReductionRule,
  PercentageDiscountRule,
} from '../../src/models';
import { PromotionEngine } from '../../src/services/promotion-engine';

describe('Promotion engine', () => {
  let cart: Cart;
  let promotionEngine: PromotionEngine;

  let productOne: Product;
  let productTwo: Product;
  let productThree: Product;

  beforeEach(() => {
    cart = new Cart();
    promotionEngine = new PromotionEngine();

    productOne = new Product('001', 'Curry Sauce', 1.95);
    productTwo = new Product('002', 'Pizza', 5.99);
    productThree = new Product('003', 'Men\'s T-Shirt', 25);
  });

  it('should add a new promotional rule', () => {
    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    }));

    // Assuming that an array of rules is available for testing.
    // In a real scenario, we may have to adjust the implementation to test this properly.
    expect((promotionEngine as any).rules.length).toBe(1);
  });

  it('should apply percentage discount correctly', () => {
    cart.add(productOne, 5);
    cart.add(productTwo, 5);

    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    }));

    const discount = promotionEngine.applyPromotions(cart);
    expect(discount).toBeCloseTo(3.97, 2);
  });

  it('should apply bulk price reduction correctly', () => {
    cart.add(productThree, 5);

    promotionEngine.addRule(new BulkPriceReductionRule({
      product: productThree,
      minQuantity: 2,
      discountPrice: 20,
    }));

    const discount = promotionEngine.applyPromotions(cart);
    expect(discount).toBeCloseTo(25, 2);
  });

  it('should apply multiple promotions correctly', () => {
    cart.add(productThree);
    cart.add(productTwo, 2);

    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    })).addRule(new BulkPriceReductionRule({
      product: productTwo,
      minQuantity: 2,
      discountPrice: 3.99,
    }));

    const discount = promotionEngine.applyPromotions(cart);
    expect(discount).toBeCloseTo(7.698, 2);
  });

  it('should not apply any promotion if not applicable', () => {
    cart.add(productThree);

    promotionEngine.addRule(new PercentageDiscountRule({
      threshold: 30,
      discount: 10,
    }));

    const discount = promotionEngine.applyPromotions(cart);
    expect(discount).toBe(0);
  });
});

