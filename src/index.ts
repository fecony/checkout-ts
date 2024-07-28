import {
  Cart,
  Product,
  BulkPriceReductionRule,
  PercentageDiscountRule,
} from './models';
import { Checkout } from './services/checkout';
import { PromotionEngine } from './services/promotion-engine';

const curry = new Product('001', 'Curry Sauce', 1.95);
const pizza = new Product('002', 'Pizza', 5.99);
const tshirt = new Product('003', 'Men\'s T-Shirt', 25);

const promotionEngine = new PromotionEngine();

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

const checkout = new Checkout(new Cart(), promotionEngine);

const cases: Array<[Product[], number]> = [
  [[curry, pizza, tshirt], 29.65],
  [[pizza, curry, pizza], 9.93],
  [[pizza, curry, pizza, tshirt], 31.44],
];

const output = cases.map(([items, expected]) => {
  for (const product of items) {
    checkout.scan(product);
  }

  const total = checkout.total();

  checkout.clear();

  return {
    'Scanned items': items.map(item => item.name).join(', '),
    'Total (€)': total.toFixed(2),
    'Expected (€)': expected.toFixed(2),
    'Check ✓': total.toFixed(2) === expected.toFixed(2),
  };
});

console.table(output);
