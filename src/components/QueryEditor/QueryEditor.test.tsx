import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { FeedType, FeedTypeValue } from '../../constants';
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
  feedType: defaultQuery.feedType,
  dateField: 'pubDate',
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
   * Feed Type
   */
  describe('FeedType', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onFeedTypeChange;
      });

    it('Should apply feedType value and change', () => {
      const query = getQuery();
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );

      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(FeedType.find((type) => type.value === query.feedType));

      /**
       * OnChange
       */
      const newValue = FeedType.find((type) => type.value === FeedTypeValue.ITEMS);
      testedComponent.simulate('change', newValue);
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        feedType: newValue?.value,
      });
    });
  });

  /**
   * Date field
   */
  describe('DateField', () => {
    const getComponent = (wrapper: ShallowComponent) =>
      wrapper.findWhere((node) => {
        return node.prop('onChange') === wrapper.instance().onDateFieldChange;
      });

    it('Should apply dateField value and change', () => {
      const query = getQuery();
      const wrapper = shallow<QueryEditor>(
        <QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />
      );

      const testedComponent = getComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual('pubDate');

      /**
       * OnChange
       */
      testedComponent.simulate('change', { target: { value: 'date' } });
      expect(onChange).toHaveBeenCalledWith({
        ...query,
        dateField: 'date',
      });
    });
  });
});
