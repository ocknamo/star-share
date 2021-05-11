import { MockStorage } from './mock-storage';

describe('TestServices', () => {
  let myStorage: Storage;
  beforeAll(() => {
    myStorage = new MockStorage();
  });

  it('should set item', () => {
    myStorage.setItem('key', 'value');
    expect(myStorage.length).toBe(1);
  });

  it('should get item by key', () => {
    myStorage.setItem('key2', 'value2');
    expect(myStorage.getItem('key2')).toBe('value2');
  });
});
