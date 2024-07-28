
import { type Product } from './product';

export class Cart {
  protected items = new Map<Product, number>();

  /**
   * Add a product to the cart or the given quantity if already in the cart
   *
   * @param product Product to handle
   * @param quantity quantity to add to the cart
   */
  public add(product: Product, quantity = 1): void {
    const currentAmount = this.getProductAmount(product);
    this.items.set(product, currentAmount + quantity);
  }

  /**
   * Removes product from the cart
   *
   * @param product Product to handle
   * @param amount amount to substract from the cart
   */
  public remove(product: Product, amount: number): void {
    if (this.hasProduct(product)) {
      const oldAmount = this.getProductAmount(product);
      const newAmount = oldAmount - amount >= 0 ? oldAmount - amount : 0;

      this.updateProductAmount(product, newAmount);
    }
  }

  /**
   * Clears cart by removing all items
   */
  public clear(): void {
    this.items.clear();
  }

  /**
   * Returns content of the cart
   */
  public getItems(): Map<Product, number> {
    return this.items;
  }

  /**
   * Returns the total amount of items (different SKUs) in the cart
   */
  public getItemCount(): number {
    return this.items.size;
  }

  /**
   * Returns the total count of items in the cart
   */
  public getTotalCount(): number {
    return [...this.items.values()].reduce((total, amount) => total + amount, 0);
  }

  /**
   * Return the subtotal of items in the cart
   */
  public getSubtotal(): number {
    return [...this.items].reduce((total, [product, quantity]) => total + (product.price * quantity), 0);
  }

  /**
   * Check if product is in the cart
   * @param product
   */
  public hasProduct(product: Product): boolean {
    return this.items.has(product);
  }

  /**
   * Returns the amount of a given product in the cart
   *
   * @param product
   */
  public getProductAmount(product: Product): number {
    return this.items.get(product) ?? 0;
  }

  /**
   * Updates the amount of a product in the cart
   *
   * @param product to edit
   * @param amount to set in the given product
   */
  public updateProductAmount(product: Product, amount: number): void {
    if (amount > 0) {
      this.items.set(product, amount);
    } else {
      this.items.delete(product);
    }
  }

  /**
   * Update the price of a product in the cart
   *
   * @param product to edit
   * @param price to set in the given product
   */
  public updateProductPrice(product: Product, price: number): void {
    const currentAmount = this.getProductAmount(product);
    this.items.delete(product);
    product.price = price;
    this.items.set(product, currentAmount);
  }

  /**
   * Get a new instance of the Cart with the same items
   */
  public clone(): Cart {
    const newCart = new Cart();

    for (const [product, quantity] of this.items.entries()) {
      newCart.add(product, quantity);
    }

    return newCart;
  }
}
