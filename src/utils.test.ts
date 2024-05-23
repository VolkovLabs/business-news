import { createUniqueKeyObject } from './utils';

/**
 * createUniqueKeyObject
 */
describe('createUniqueKeyObject', () => {
  it('Returns an empty object for an empty input array', () => {
    const result = createUniqueKeyObject([]);
    expect(result).toEqual({});
  });

  it('Creates a unique key object for a non-empty array', () => {
    const items = [
      { name: 'John', age: 30 },
      { name: 'Jane', email: 'jane@example.com' },
      { name: 'Bob', age: 25, email: 'bob@example.com' },
    ];

    const result = createUniqueKeyObject(items as any);
    expect(result).toEqual({
      name: [],
      age: [],
      email: [],
    });
  });

  it('handles duplicate keys in the array', () => {
    const items = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 35 },
      { name: 'John', email: 'john@example.com' },
    ];

    const result = createUniqueKeyObject(items as any);
    expect(result).toEqual({
      name: [],
      age: [],
      email: [],
    });
  });
});
