import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { defaultQuery, Query } from '../../types';
import { QueryEditor } from './QueryEditor';

/**
 * Component
 */
type ShallowComponent = ShallowWrapper<QueryEditor['props'], QueryEditor['state'], QueryEditor>;

/**
 * Get Query with default values and ability to override
 *
 * @param overrideQuery
 */
export const getQuery = (overrideQuery = {}): Query => ({
  queryText: defaultQuery.queryText,
  refId: 'A',
  ...overrideQuery,
});

/**
 * Query Editor
 */
describe('QueryEditor', () => {
  const onRunQuery = jest.fn();
  const onChange = jest.fn();

  beforeEach(() => {
    onRunQuery.mockReset();
    onChange.mockReset();
  });

  /**
   * Query Text
   */
  describe('QueryText', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onQueryTextChange;
      });

    it('Should apply queryText value and change', () => {
      const query = getQuery();
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );

      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(defaultQuery.queryText);

      /**
       * OnChange
       */
      const newValue = 'new';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        queryText: newValue,
      });
    });
  });
});
