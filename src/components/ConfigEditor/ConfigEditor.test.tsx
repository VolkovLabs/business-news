import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { DataSourceSettings } from '@grafana/data';
import { DataSourceOptions } from '../../types';
import { ConfigEditor } from './ConfigEditor';

/**
 * Component
 */
type ShallowComponent = ShallowWrapper<ConfigEditor['props'], ConfigEditor['state'], ConfigEditor>;

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
const getOptions = ({
  jsonData = {},
  secureJsonData = {},
  ...overrideOptions
}: OverrideOptions = {}): DataSourceSettings<DataSourceOptions, any> => ({
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
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onFeedChange;
      });

    it('Should apply path value and change options if field was changed', () => {
      const options = getOptions({ jsonData: { feed: '/feed' } });
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onChange} />);

      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(options.jsonData.feed);

      const newValue = '/123';
      testedComponent.simulate('change', { target: { value: newValue } });
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
