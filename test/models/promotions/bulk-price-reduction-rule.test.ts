import { Product } from '../../../src/models';
import {
  BulkPriceReductionRule,
  type BulkPriceReductionRuleConfig,
} from '../../../src/models/promotions/bulk-price-reduction-rule';

describe('Bulk price reduction rule', () => {
  const ruleConfig: BulkPriceReductionRuleConfig = {
    productCode: '002',
    minQuantity: 3,
    reducedPrice: 3.99,
  };

  const products = [
    new Product('001', 'Curry Sauce', 1.95),
    new Product('002', 'Pizza', 5.99),
    new Product('002', 'Pizza', 5.99),
    new Product('002', 'Pizza', 5.99),
    new Product('003', 'Men\'s T-Shirt', 25),
  ];

  it('should be applicable to products that fulfil the criteria', () => {
    const rule = new BulkPriceReductionRule(ruleConfig);

    expect(rule.isApplicable(products)).toBe(true);
  });

  it('shouldn\'t be applied to products that don\'t fulfil the criteria', () => {
    const rule = new BulkPriceReductionRule({...ruleConfig, minQuantity: 4});

    expect(rule.isApplicable(products)).toBe(false);
  });

  test('should apply discount correctly', () => {
    const rule = new BulkPriceReductionRule(ruleConfig);

    const reducedTotalPrice = rule.apply(products);
    expect(reducedTotalPrice).toBe(3 * (ruleConfig.reducedPrice));
  });

  it('should apply discount correctly when fewer than minQuantity are present', () => {
    const fewerProducts = [
      new Product('002', 'Pizza', 5.99),
      new Product('002', 'Pizza', 5.99),

    ];
    const rule = new BulkPriceReductionRule(ruleConfig);

    expect(rule.isApplicable(fewerProducts)).toBe(false);
    expect(rule.apply(fewerProducts)).toBe(0);
  });
});
