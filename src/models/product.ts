import { NegativePriceError, NegativePriceInCentsError } from '../errors';

export class Product {
  private _price: number;

  constructor(
    public code: string,
    public name: string,
    price: number,
  ) {
    if (price < 0) {
      throw new NegativePriceError();
    }

    this._price = this.roundToTwoDecimals(price);
  }

  get price(): number {
    return this._price;
  }

  set price(price: number) {
    if (price < 0) {
      throw new NegativePriceError();
    }

    this._price = this.roundToTwoDecimals(price);
  }

  get priceInCents(): number {
    return Math.round(this._price * 100);
  }

  set priceInCents(priceInCents: number) {
    if (priceInCents < 0) {
      throw new NegativePriceInCentsError();
    }

    this._price = this.roundToTwoDecimals(priceInCents / 100);
  }

  private roundToTwoDecimals(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
