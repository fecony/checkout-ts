import { Product } from '../../src/models';
import {
  NegativePriceError,
  NegativePriceInCentsError,
} from '../../src/errors';

describe('product', () => {
  it('should initialize correctly', () => {
    const product = new Product('001', 'Curry Sauce', 1.95);

    expect(product.code).toBe('001');
    expect(product.name).toBe('Curry Sauce');
    expect(product.price).toBeCloseTo(1.95, 2);
    expect(product.priceInCents).toBe(195);
  });

  describe('price', () => {
    it('should get and set price correctly', () => {
      const product = new Product('002', 'Pizza', 5.99);

      expect(product.price).toBeCloseTo(5.99, 2);
      expect(product.priceInCents).toBe(599);

      product.price = 6.49;

      expect(product.price).toBeCloseTo(6.49, 2);
      expect(product.priceInCents).toBe(649);
    });

    it('should maintain the accuracy of the conversion', () => {
      const product = new Product('003', 'Men’s T-Shirt', 25);

      expect(product.priceInCents).toBe(2500);
      expect(product.price).toBeCloseTo(25, 2);

      product.priceInCents = 499;

      expect(product.priceInCents).toBe(499);
      expect(product.price).toBeCloseTo(4.99, 2);

      product.price = 5.75;

      expect(product.priceInCents).toBe(575);
      expect(product.price).toBeCloseTo(5.75, 2);
    });

    describe('zero price', () => {
      it('should allow setting price to zero', () => {
        const product = new Product('000', 'Sample Product', 0);
        expect(product.price).toBeCloseTo(0, 2);
        expect(product.priceInCents).toBe(0);

        product.price = 0;

        expect(product.price).toBeCloseTo(0, 2);
        expect(product.priceInCents).toBe(0);
      });

      it('should allow setting price in cents to zero', () => {
        const product = new Product('000', 'Sample Product', 0);
        expect(product.priceInCents).toBe(0);
        expect(product.price).toBeCloseTo(0, 2);

        product.priceInCents = 0;

        expect(product.priceInCents).toBe(0);
        expect(product.price).toBeCloseTo(0, 2);
      });
    });

    describe('price rounding', () => {
      it('should round price and priceInCents correctly', () => {
        const product = new Product('000', 'Sample Product', 2.999);
        expect(product.priceInCents).toBe(300);
        expect(product.price).toBeCloseTo(3, 2);

        product.price = 3.335;

        expect(product.priceInCents).toBe(334);
        expect(product.price).toBeCloseTo(3.34, 2);
      });

      it('should round price with many decimal places correctly', () => {
        const product = new Product('000', 'Sample Product', 3.141_592_653_5);
        expect(product.priceInCents).toBe(314); // Rounds to 3.14
        expect(product.price).toBeCloseTo(3.14, 2);
      });
    });
  });

  describe('negative price', () => {
    it('should throw NegativePriceError when price is negative', () => {
      expect(() => {
        const _product = new Product('000', 'Sample Product', -1);
      }).toThrow(NegativePriceError);
    });

    it('should throw NegativePriceError when setting negative price', () => {
      const product = new Product('000', 'Sample Product', 2);
      expect(() => {
        product.price = -3;
      }).toThrow(NegativePriceError);
    });

    it('should throw NegativePriceInCentsError when setting price in cents', () => {
      const product = new Product('000', 'Sample Product', 2);
      expect(() => {
        product.priceInCents = -200;
      }).toThrow(NegativePriceInCentsError);
    });
  });
});
