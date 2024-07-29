import { Cart, Product } from '../../../src/models';
import { BuyOneGetOneRule } from '../../../src/models/promotions/buy-one-get-one-rule';

describe('Buy one get one free rule', () => {
  let cart: Cart;
  let pizza: Product;
  let rule: BuyOneGetOneRule;

  beforeEach(() => {
    cart = new Cart();
    pizza = new Product('002', 'Pizza', 5.99);
    rule = new BuyOneGetOneRule({ product: pizza });
  });

  it('should apply discount when at least 2 items are in the cart', () => {
    cart.add(pizza, 4);

    const discount = rule.apply(cart);

    expect(discount).toBe(11.98);
  });

  it('should apply discount correctly with multiple quantities and products', () => {
    const extraPizza = new Product('003', 'Extra Pizza', 7.99);
    cart.add(pizza, 6);
    cart.add(extraPizza, 1);

    const discount = rule.apply(cart);

    expect(discount).toBe(17.97);
  });

  it('should not apply discount if less than 2 items are in the cart', () => {
    cart.add(pizza, 1);

    const discount = rule.apply(cart);

    expect(discount).toBe(0);
  });

  it('should apply discount correctly when exactly 2 items are in the cart', () => {
    cart.add(pizza, 2);

    const discount = rule.apply(cart);

    expect(discount).toBe(5.99);
  });

  it('should handle multiple products in the cart', () => {
    const currySauce = new Product('001', 'Curry Sauce', 1.95);

    cart.add(pizza, 3);
    cart.add(currySauce, 2);

    const discount = rule.apply(cart);

    expect(discount).toBe(5.99);
  });

  it('should not apply discount if the product is not in the cart', () => {
    const currySauce = new Product('001', 'Curry Sauce', 1.95);
    cart.add(currySauce, 3);

    const discount = rule.apply(cart);

    expect(discount).toBe(0);
  });
});
