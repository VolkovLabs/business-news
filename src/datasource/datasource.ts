import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { Api } from '../api';
import { DataSourceTestStatus } from '../constants';
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
    const { range } = options;

    /**
     * Process targets
     */
    const data = options.targets.map((target) => this.api.getData(target, range));

    /**
     * Return data
     */
    return { data };
  }

  /**
   * Health Check
   */
  async testDatasource() {
    const isStatusOk = true;

    /**
     * Return
     */
    return {
      status: isStatusOk ? DataSourceTestStatus.SUCCESS : DataSourceTestStatus.ERROR,
      message: isStatusOk ? `Connected...` : "Error. Can't connect.",
    };
  }
}
