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
   * @type {Record<string, any>}
   */
  params?: Record<string, any>;
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
