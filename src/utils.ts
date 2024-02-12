import { TimeRange } from '@grafana/data';
import { FeedItems } from 'types';
/**
 * Set or added Item values
 */
export const setItem = (items: FeedItems, key: string, value: string) => {
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
