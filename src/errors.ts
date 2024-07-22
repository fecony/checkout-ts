export class NegativePriceError extends Error {
  constructor() {
    super('Price cannot be negative')
    this.name = 'NegativePriceError'
  }
}

export class NegativePriceInCentsError extends Error {
  constructor() {
    super('Price in cents cannot be negative')
    this.name = 'NegativePriceInCentsError'
  }
}
