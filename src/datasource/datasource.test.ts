import { dateTime, MutableDataFrame } from '@grafana/data';
import { DataSourceTestStatus } from '../constants';
import { DataSource } from './datasource';

/**
 * Data Source
 */
describe('DataSource', () => {
  const instanceSettings: any = {};
  const dataSource = new DataSource(instanceSettings);

  /**
   * Time Range
   */
  const range = {
    from: dateTime(),
    to: dateTime(),
    raw: {
      from: dateTime(),
      to: dateTime(),
    },
  };

  /**
   * Query
   */
  describe('Query', () => {
    it('Should return correct data for MUTABLE frame', async () => {
      const targets = [{ refId: 'A', queryText: 'test' }];

      const data = await dataSource.query({ targets, range } as any);
      const frames = data.data;
      expect(frames[0]).toBeInstanceOf(MutableDataFrame);
      expect(frames[0].fields.length).toEqual(2);
    });
  });

  /**
   * Health Check
   */
  describe('testDatasource', () => {
    it('Should handle Success state', async () => {
      const result = await dataSource.testDatasource();
      expect(result).toEqual({
        status: DataSourceTestStatus.SUCCESS,
        message: `Connected...`,
      });
    });
  });
});
