import { IBasketModel, Product } from "../../types";

export class BasketModel implements IBasketModel {
  _items: Map<string, Product> = new Map();

  add(product: Product): void {
    this._items.set(product.id, product);
  }

  remove(id: string): void {
    if (this.hasItem(id)) {
      this._items.delete(id);
    }
  }

  getItems(): Product[] {
    return Array.from(this._items.values());
  }

  clear(): void {
    this._items.clear();
  }

  hasItem(id: string): boolean {
    return this._items.has(id);
  }
}
