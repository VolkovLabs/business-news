import { DataSourceInstanceSettings, FieldType, MutableDataFrame, TimeRange } from '@grafana/data';
import { DataSourceOptions, Query } from '../types';

/**
 * API
 */
export class Api {
  /**
   * Constructor
   */
  constructor(public instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {}

  /**
   * Get data
   */
  getData(query: Query, range: TimeRange): MutableDataFrame {
    return new MutableDataFrame({
      refId: query.refId,
      fields: [
        { name: 'Time', values: [range.from, range.to], type: FieldType.time },
        { name: 'Value', values: [1, 2], type: FieldType.number },
      ],
    });
  }
}
