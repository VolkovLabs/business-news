import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { Api } from '../api';
import { DataSourceTestStatus, FeedTypeValue } from '../constants';
import { DataSourceOptions, Query } from '../types';

/**
 * Datasource
 */
export class DataSource extends DataSourceApi<Query, DataSourceOptions> {
  /**
   * Api
   *
   * @type {Api} api
   */
  api: Api;

  /**
   * Constructor
   */
  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {
    super(instanceSettings);
    this.api = new Api(instanceSettings);
  }

  /**
   * Query
   */
  async query(options: DataQueryRequest<Query>): Promise<DataQueryResponse> {
    const { range, scopedVars } = options;
    const data: DataFrame[] = [];

    /**
     * Process targets
     */
    await Promise.all(
      options.targets.map(async (target) => {
        const params = target.params ? target.params : {};

        /**
         * Replace Variables
         */
        if (Object.keys(params).length) {
          Object.keys(params).forEach((param) => {
            params[param] = getTemplateSrv().replace(params[param], scopedVars);
          });
        }

        /**
         * Get Data Frame from Feed
         */
        const frames = await this.api.getFeed(target, range, params);
        if (frames && frames.length) {
          data.push(...frames);
        }
      })
    );

    /**
     * Return data
     */
    return { data };
  }

  /**
   * Health Check
   */
  async testDatasource() {
    /**
     * Get RSS Feed
     */
    const frames = await this.api.getFeed({
      refId: 'A',
      feedType: FeedTypeValue.ALL,
    });

    const isStatusOk = frames.length ? true : false;

    /**
     * Return
     */
    return {
      status: isStatusOk ? DataSourceTestStatus.SUCCESS : DataSourceTestStatus.ERROR,
      message: isStatusOk ? `Connected.` : "Error. Can't connect.",
    };
  }
}
