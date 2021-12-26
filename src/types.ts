import { DataQuery, DataSourceJsonData } from '@grafana/data';

/**
 * Query
 */
export interface Query extends DataQuery {
  /**
   * Query Text
   *
   * @type {string}
   */
  queryText?: string;
}

/**
 * Defaults for Query
 */
export const defaultQuery: Partial<Query> = {
  queryText: 'test',
};

/**
 * Datasource Options
 */
export interface DataSourceOptions extends DataSourceJsonData {
  /**
   * Path
   *
   * @type {string}
   */
  path?: string;
}

/**
 * Secure JSON Data
 */
export interface SecureJsonData {
  /**
   * API Key
   *
   * @type {string}
   */
  apiKey?: string;
}
