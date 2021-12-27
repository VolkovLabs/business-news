import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { FeedTypeValue } from './constants';

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
}

/**
 * Defaults for Query
 */
export const defaultQuery: Partial<Query> = {
  feedType: FeedTypeValue.ALL,
};

/**
 * Datasource Options
 */
export interface DataSourceOptions extends DataSourceJsonData {
  /**
   * URL to access RSS Feed
   *
   * @type {string}
   */
  feed: string;
}
