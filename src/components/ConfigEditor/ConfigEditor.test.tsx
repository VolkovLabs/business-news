import { DataSourceSettings } from '@grafana/data';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { DataSourceOptions } from '../../types';
import { ConfigEditor } from './ConfigEditor';

/**
 * Override Options
 */
interface OverrideOptions {
  [key: string]: unknown;
  jsonData?: object;
  secureJsonData?: object | null;
}

/**
 * Configuration Options
 */
const getOptions = ({ jsonData = {}, secureJsonData, ...overrideOptions }: OverrideOptions = {}): DataSourceSettings<
  DataSourceOptions,
  any
> => ({
  id: 1,
  orgId: 2,
  name: '',
  typeLogoUrl: '',
  type: '',
  uid: '',
  typeName: '',
  access: '',
  url: '',
  user: '',
  database: '',
  basicAuth: false,
  basicAuthUser: '',
  isDefault: false,
  secureJsonFields: {},
  readOnly: false,
  withCredentials: false,
  ...overrideOptions,
  jsonData: {
    feed: '',
    ...jsonData,
  },
});

/**
 * Config Editor
 */
describe('ConfigEditor', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  /**
   * RSS Feed
   */
  describe('Feed', () => {
    it('Should apply path value and change options if field was changed', async () => {
      const options = getOptions({ jsonData: { feed: '/feed' } });

      render(<ConfigEditor options={options} onOptionsChange={onChange} />);

      const fieldUrl = screen.getByTestId(TEST_IDS.configEditor.fieldUrl);

      expect(fieldUrl).toHaveValue(options.jsonData.feed);

      const newValue = '/123';

      await act(() => fireEvent.change(fieldUrl, { target: { value: newValue } }));

      expect(onChange).toHaveBeenCalledWith({
        ...options,
        jsonData: {
          ...options.jsonData,
          feed: newValue,
        },
      });
    });
  });
});
