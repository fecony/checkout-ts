import currency from 'currency.js';
import { NegativePriceError, NegativePriceInCentsError } from '../errors';

export class Product {
  private _price: currency;

  constructor(
    public sku: string,
    public name: string,
    price: number,
  ) {
    if (price < 0) {
      throw new NegativePriceError();
    }

    this._price = currency(price, { precision: 2 });
  }

  get price(): number {
    return this._price.value;
  }

  set price(price: number) {
    if (price < 0) {
      throw new NegativePriceError();
    }

    this._price = currency(price, { precision: 2 });
  }

  get priceInCents(): number {
    return this._price.intValue;
  }

  set priceInCents(priceInCents: number) {
    if (priceInCents < 0) {
      throw new NegativePriceInCentsError();
    }

    this._price = currency(priceInCents / 100, { precision: 2 });
  }

  // ToString(): string {
  //   return this.sku;
  // }
}
