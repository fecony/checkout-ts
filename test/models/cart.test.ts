import { Cart, Product } from '../../src/models';

describe('cart', () => {
  let testCart: Cart;
  let productOne: Product;
  let productTwo: Product;
  let productThree: Product;

  beforeEach(() => {
    testCart = new Cart();
    productOne = new Product('001', 'A', 10);
    productTwo = new Product('002', 'B', 20);
    productThree = new Product('003', 'C', 30);
  });

  it('should initialize empty cart correctly', () => {
    expect(testCart.getItemCount()).toBe(0);
    expect(testCart.getTotalCount()).toBe(0);
  });

  it('should creates a cart and add products', () => {
    testCart.add(productOne);

    expect(testCart.getTotalCount()).toBe(1);
    expect(testCart.getItemCount()).toBe(1);
  });

  describe('cart operations', () => {
    it('should add an item, allow add/remove operations', () => {
      testCart.add(productOne, 1);
      testCart.add(productOne, 5);

      expect(testCart.getTotalCount()).toBe(6);

      testCart.remove(productOne, 2);
      expect(testCart.getTotalCount()).toBe(4);

      testCart.remove(productOne, 5);
      expect(testCart.getTotalCount()).toBe(0);
    });

    it('should handle item removal', () => {
      testCart.add(productOne, 30);
      testCart.remove(productOne, 31);

      expect(testCart.getTotalCount()).toBe(0);
      expect(testCart.getItemCount()).toBe(0);
    });

    it('shouldn\'t allow negative ammounts', () => {
      testCart.add(productOne, 30);
      testCart.remove(productOne, 31);

      expect(testCart.getTotalCount()).toBe(0);

      testCart.add(productOne, 30);
      testCart.updateProductAmount(productOne, -1);

      expect(testCart.getTotalCount()).toBe(0);
    });

    it('should handle multiple items', () => {
      testCart.add(productOne);
      expect(testCart.getTotalCount()).toBe(1);
      expect(testCart.getItemCount()).toBe(1);

      testCart.add(productOne);
      expect(testCart.getTotalCount()).toBe(2);
      expect(testCart.getItemCount()).toBe(1);

      testCart.add(productTwo);
      expect(testCart.getTotalCount()).toBe(3);
      expect(testCart.getItemCount()).toBe(2);

      testCart.add(productThree, 20);
      expect(testCart.getTotalCount()).toBe(23);
      expect(testCart.getItemCount()).toBe(3);

      testCart.remove(productThree, 1);
      expect(testCart.getTotalCount()).toBe(22);
      expect(testCart.getItemCount()).toBe(3);

      testCart.remove(productTwo, 1);
      expect(testCart.getTotalCount()).toBe(21);
      expect(testCart.getItemCount()).toBe(2);

      testCart.remove(productOne, 100);
      testCart.remove(productThree, 100);
      expect(testCart.getTotalCount()).toBe(0);
      expect(testCart.getItemCount()).toBe(0);
    });

    describe('get product amount', () => {
      it('should return correct product amount in the cart', () => {
        testCart.add(productOne);
        testCart.add(productTwo, 2);

        expect(testCart.getProductAmount(productOne)).toBe(1);
        expect(testCart.getProductAmount(productTwo)).toBe(2);
      });

      it('should return correct multiple product amount in the cart', () => {
        testCart.add(productOne);

        expect(testCart.getProductAmount(productOne)).toBe(1);
        expect(testCart.getProductAmount(productTwo)).toBe(0);

        testCart.add(productTwo, 20);

        expect(testCart.getProductAmount(productOne)).toBe(1);
        expect(testCart.getProductAmount(productTwo)).toBe(20);
      });
    });

    describe('update product amount', () => {
      it('should update product amount properly', () => {
        testCart.add(productOne);
        expect(testCart.getProductAmount(productOne)).toBe(1);

        testCart.updateProductAmount(productOne, 5);
        expect(testCart.getProductAmount(productOne)).toBe(5);

        testCart.add(productTwo);
        testCart.updateProductAmount(productTwo, 10);
        expect(testCart.getProductAmount(productOne)).toBe(5);
        expect(testCart.getProductAmount(productTwo)).toBe(10);
      });

      it('should remove product from cart when amount is set to 0', () => {
        testCart.add(productOne);
        expect(testCart.getProductAmount(productOne)).toBe(1);

        testCart.updateProductAmount(productOne, 5);
        expect(testCart.getProductAmount(productOne)).toBe(5);

        testCart.add(productTwo);
        testCart.updateProductAmount(productOne, 0);
        testCart.updateProductAmount(productTwo, 10);
        expect(testCart.getProductAmount(productOne)).toBe(0);
        expect(testCart.getProductAmount(productTwo)).toBe(10);
      });
    });

    describe('update product price', () => {
      it('should update product price in the cart', () => {
        testCart.add(productOne);

        const cartItem = testCart.getItems().keys().next().value as Product;
        expect(cartItem.price).toBe(10);

        testCart.updateProductPrice(productOne, 100);

        const productAfter = testCart.getItems().keys().next().value as Product;
        expect(productAfter.price).toBe(100);
      });

      it('should update correct product price in multiple product cart', () => {
        testCart.add(productOne);
        testCart.add(productTwo);

        const items = testCart.getItems().keys();
        const cartOneItem = items.next().value as Product;
        const cartTwoItem = items.next().value as Product;

        expect(cartOneItem.price).toBe(10);
        expect(cartTwoItem.price).toBe(20);

        testCart.updateProductPrice(productOne, 100);

        expect(cartOneItem.price).toBe(100);
        expect(cartTwoItem.price).toBe(20);
      });
    });

    describe('clone', () => {
      it('should result in an empty cart when empty cart is cloned', () => {
        const clonedCart = testCart.clone();

        expect(clonedCart.getItems().size).toBe(0);
        expect(testCart.getItems().size).toBe(0);
      });

      it('should clone a cart correctly', () => {
        testCart.add(productOne, 2);
        testCart.add(productTwo, 3);

        const clonedCart = testCart.clone();

        expect(clonedCart).not.toBe(testCart);
        expect(clonedCart.getItems()).toEqual(testCart.getItems());
      });

      it('should not affect original cart when modifying the cloned cart', () => {
        testCart.add(productOne, 2);
        testCart.add(productTwo, 3);

        const clonedCart = testCart.clone();
        clonedCart.add(productOne, 1);

        expect(clonedCart.getProductAmount(productOne)).toBe(3);
        expect(testCart.getProductAmount(productOne)).toBe(2);
      });
    });
  });
});
