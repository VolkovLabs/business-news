import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
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
    const data: DataFrame[] = [];

    /**
     * Process targets
     */
    await Promise.all(
      options.targets.map(async (target) => {
        const frames = await this.api.getFeed(target);
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

    const isStatusOk = frames?.length ? true : false;

    /**
     * Return
     */
    return {
      status: isStatusOk ? DataSourceTestStatus.SUCCESS : DataSourceTestStatus.ERROR,
      message: isStatusOk ? `Connected...` : "Error. Can't connect.",
    };
  }
}
