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
  password: '',
  user: '',
  database: '',
  basicAuth: false,
  basicAuthPassword: '',
  basicAuthUser: '',
  isDefault: false,
  secureJsonFields: {},
  readOnly: false,
  withCredentials: false,
  ...overrideOptions,
  jsonData: {
    path: '',
    ...jsonData,
  },
  secureJsonData: {
    apiKey: '',
    ...secureJsonData,
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
   * Path
   */
  describe('Path', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onPathChange;
      });

    it('Should apply path value and change options if field was changed', () => {
      const options = getOptions({ jsonData: { path: '/abc' } });
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onChange} />);

      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(options.jsonData.path);

      const newValue = '/123';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...options,
        jsonData: {
          ...options.jsonData,
          path: newValue,
        },
      });
    });
  });

  /**
   * API Key
   */
  describe('APIKey', () => {
    const label = 'API Key';

    it('Should apply APIKey value and change options if field was changed', () => {
      const options = getOptions({
        secureJsonFields: { apiKey: true },
        secureJsonData: { apiKey: '123' },
      });
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onChange} />);

      /**
       * Check component
       */
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === label);
      expect(testedComponent.prop('value')).toEqual(options.secureJsonData.apiKey);
      expect(testedComponent.prop('isConfigured')).toBeTruthy();

      /**
       * Simulate OnChange
       */
      const newValue = 'newKey';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...options,
        secureJsonData: {
          ...options.secureJsonData,
          apiKey: newValue,
        },
      });
    });

    it('Should be Ok with not secureJsonData', () => {
      const options = getOptions();
      delete options.secureJsonData;
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onChange} />);

      /**
       * Check component
       */
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === label);
      expect(testedComponent.prop('value')).toEqual('');
      expect(testedComponent.prop('isConfigured')).toBeFalsy();
    });

    it('Should reset APIKey', () => {
      const options = getOptions({
        secureJsonFields: { apiKey: true },
        secureJsonData: {},
      });

      /**
       * Check component
       */
      const wrapper = shallow<ConfigEditor>(<ConfigEditor options={options} onOptionsChange={onChange} />);
      const testedComponent = wrapper.findWhere((node) => node.prop('label') === label);

      /**
       * Simulate OnChange
       */
      expect(testedComponent.prop('isConfigured')).toBeTruthy();
      testedComponent.simulate('reset');
      expect(onChange).toHaveBeenCalledWith({
        ...options,
        secureJsonFields: {
          ...options.secureJsonFields,
          apiKey: false,
        },
        secureJsonData: {
          ...options.secureJsonData,
          apiKey: '',
        },
      });
    });
  });
});
