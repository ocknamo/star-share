/**
 * This is an on memory storage mock instead of localStorage.
 * Only use is "getItem" and  "setItem".
 */
export class MockStorage implements Storage {
  length: number;

  private store = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store = { ...this.store, ...{ [key]: value } };
    this.length = Object.keys(this.store).length;
  }

  // TODO: implement methods if you need.
  clear(): void {}

  key(index: number): string | null {
    return null;
  }

  removeItem(key: string): void {}
}
