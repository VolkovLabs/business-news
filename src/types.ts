import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

/**
 * Query
 */
export interface Query extends DataQuery {
  /**
   * Feed Type
   *
   * @type {string}
   */
  feedType?: string;

  /**
   * Date field to filter items
   *
   * @type {string}
   */
  dateField?: string;

  /**
   * URL Params
   *
   * @type {Record<string, string>}
   */
  params?: Record<string, string>;
}

/**
 * Data source Options
 */
export interface DataSourceOptions extends DataSourceJsonData {
  /**
   * URL to access RSS Feed
   *
   * @type {string}
   */
  feed: string;
}

/**
 * Feed items
 */
export interface FeedItems {
  /**
   * Mapping of ID to an array of strings or strings and null
   *
   * @type {Record<string, (string | null)[]>}
   */
  [id: string]: Array<string | null>;
}

/**
 * Data item
 */
export interface DataItem {
  /**
   * Data Item
   *
   * @type {[key: string]: string | Record<string, string> }
   */
  [key: string]: string | Record<string, string> | Record<string, object>;
}

/**
 * Unique Key Info
 */
export interface UniqueKeyInfo {
  /**
   * key Accessor
   *
   * @type {string}
   */
  keyAccessor?: string;

  /**
   * value Accessor
   *
   * @type {string}
   */
  valueAccessor: string;
}
