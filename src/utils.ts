import { TimeRange } from '@grafana/data';
import { DataItem, FeedItems } from 'types';
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
 * Сreate Unique Key Object
 * Linear pass of items and forming an object with unique keys based on an array of objects
 */
export const createUniqueKeyObject = (items: DataItem[]) =>
  items.reduce((result: Record<string, string[]>, obj) => {
    Object.keys(obj).forEach((key) => {
      if (!result[key]) {
        result[key] = [];
      }
    });
    return result;
  }, {});
