import { DataQuery, DataSourceJsonData } from '@grafana/data';

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
}

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
