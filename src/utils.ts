import { TimeRange } from '@grafana/data';
import { get } from 'lodash';
import { DataItem, FeedItems, KeyConfig } from 'types';

import { ItemKey } from './constants';
/**
 * Set or added Item values
 */
export const setItem = (items: FeedItems, key: string, value: string | null) => {
  items[key] ? items[key].push(value) : (items[key] = [value]);
};

/**
 * Check if date inside Time Range
 *
 * @returns {boolean}
 */
export const isDateBetweenRange = (value: string, range: TimeRange): boolean => {
  const pubDate = Date.parse(value) / 1000;
  if (!pubDate) {
    return false;
  }

  /**
   * Return false if out of range
   */
  if (range.from.unix() > pubDate || range.to.unix() < pubDate) {
    return false;
  }

  return true;
};

/**
 * Create Unique Key Object
 * Linear pass of items and forming an object with unique keys based on an array of objects
 */
export const getUniqueAtomKeys = (items: DataItem[]) => {
  return items.reduce((result: Record<string, string[]>, obj) => {
    Object.keys(obj).forEach((key) => {
      if (!result[key]) {
        result[key] = [];
      }
    });
    return result;
  }, {});
};

/**
 * Get all item key configs
 * @param items
 */
export const getAllItemKeyConfigs = (items: DataItem[]): Record<string, KeyConfig> => {
  const result: Record<string, KeyConfig> = {};

  /**
   * Go through all the objects in the array
   */
  for (const item of items) {
    /**
     * Handle other keys
     */
    for (const key in item) {
      if (key !== ItemKey.META && key !== ItemKey.GUID && !result[key]) {
        result[key] = {
          valueAccessor: key,
        };
      }

      /**
       * If the object has a guid key
       */
      if (key === ItemKey.GUID) {
        result[key] = {
          valueAccessor: 'guid.#text',
        };
      }

      /**
       * If the object has a content:encoded key
       */
      if (key === ItemKey.CONTENT_ENCODED) {
        const contentEncodedKeys = [ItemKey.CONTENT_H4, ItemKey.CONTENT_IMG, ItemKey.CONTENT_IMG_SRC];

        contentEncodedKeys.forEach((contentKey) => {
          if (!result[contentKey]) {
            result[contentKey] = {
              valueAccessor: key,
            };
          }
        });
      }

      /**
       * If the object has a “meta” key
       */
      if (key === ItemKey.META) {
        const property = get(item.meta, '@_property');

        /**
         * If the “meta” key has not yet been added to the resulting object
         */
        if (property && !result[property]) {
          result[property] = {
            keyAccessor: 'meta.@_property',
            valueAccessor: 'meta.@_content',
          };
        }
      }
    }
  }

  return result;
};
