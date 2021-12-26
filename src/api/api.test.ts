import { dateTime } from '@grafana/data';
import { Api } from './api';

/**
 * API
 */
describe('Api', () => {
  const instanceSettings: any = {};

  /**
   * Api
   */
  const api = new Api(instanceSettings);

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
   * getData
   */
  describe('getData', () => {
    it('Should make getData request', async () => {
      const result = api.getData({ refId: 'A', queryText: 'test' }, range);
      expect(result.fields.length).toEqual(2);
    });
  });
});
