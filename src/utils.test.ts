import { getAllItemKeyConfigs, getUniqueAtomKeys } from './utils';

describe('utils', () => {
  describe('getUniqueAtomKeys', () => {
    it('Should return an empty object for an empty input array', () => {
      const result = getUniqueAtomKeys([]);
      expect(result).toEqual({});
    });

    it('Should create a unique key object for a non-empty array', () => {
      const items = [
        { name: 'John', age: 30 },
        { name: 'Jane', email: 'jane@example.com' },
        { name: 'Bob', age: 25, email: 'bob@example.com' },
      ];

      const result = getUniqueAtomKeys(items as any);
      expect(result).toEqual({
        name: [],
        age: [],
        email: [],
      });
    });

    it('Should handle duplicate keys in the array', () => {
      const items = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 35 },
        { name: 'John', email: 'john@example.com' },
      ];

      const result = getUniqueAtomKeys(items as any);
      expect(result).toEqual({
        name: [],
        age: [],
        email: [],
      });
    });
  });

  describe('getAllItemKeyConfigs', () => {
    it('Should return an empty object for an empty input array', () => {
      const result = getAllItemKeyConfigs([]);
      expect(result).toEqual({});
    });

    it('should return the correct unique channel keys', () => {
      const items = [
        {
          title: 'Item 1',
          description: 'Description 1',
          guid: {
            '#text': 'guid-1',
          },
          meta: {
            '@_property': 'og:title',
            '@_content': 'Title',
          },
        },
        {
          title: 'Item 2',
          description: 'Description 2',
          'content:encoded': '<h4>Content 1</h4>',
          guid: {
            '#text': 'guid-2',
          },
          meta: {
            '@_property': 'og:image',
            '@_content': 'src image',
          },
        },
      ] as any;

      const expectedResult = {
        title: {
          valueAccessor: 'title',
        },
        description: {
          valueAccessor: 'description',
        },
        guid: {
          valueAccessor: 'guid.#text',
        },
        'og:image': {
          keyAccessor: 'meta.@_property',
          valueAccessor: 'meta.@_content',
        },
        'og:title': {
          keyAccessor: 'meta.@_property',
          valueAccessor: 'meta.@_content',
        },
        'content:encoded': {
          valueAccessor: 'content:encoded',
        },
        'content:h4': {
          valueAccessor: 'content:encoded',
        },
        'content:img': {
          valueAccessor: 'content:encoded',
        },
        'content:img-src': {
          valueAccessor: 'content:encoded',
        },
      };

      expect(getAllItemKeyConfigs(items)).toEqual(expectedResult);
    });
  });
});
