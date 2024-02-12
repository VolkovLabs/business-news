import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { DEFAULT_QUERY, FeedTypeValue, TEST_IDS } from '../../constants';
import { Query } from '../../types';
import { QueryEditor } from './QueryEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  /**
   * Mock Select component
   */
  Select: jest.fn().mockImplementation(({ options, onChange, value, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.find((option: any) => option.value === event.target.value));
        }
      }}
      /**
       * Fix jest warnings because null value.
       * For Select component in @grafana/ui should be used null to reset value.
       */
      value={value === null ? '' : value}
      {...restProps}
    >
      {options.map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )),
}));

/**
 * Get Query with default values and ability to override
 *
 * @param overrideQuery
 */
export const getQuery = (overrideQuery = {}): Query => ({
  feedType: DEFAULT_QUERY.feedType,
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
    it('Should apply feedType value and change', async () => {
      const query = getQuery();

      render(<QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />);

      const field = screen.getByLabelText(TEST_IDS.queryEditor.fieldFeedType);

      expect(field).toHaveValue(FeedTypeValue.ALL);

      /**
       * OnChange
       */

      await act(() => fireEvent.change(field, { target: { value: FeedTypeValue.CHANNEL } }));

      expect(onChange).toHaveBeenCalledWith({
        ...query,
        feedType: FeedTypeValue.CHANNEL,
      });
    });
  });

  /**
   * Date field
   */
  describe('DateField', () => {
    it('Should apply dateField value and change', async () => {
      const query = getQuery();

      render(<QueryEditor datasource={[] as any} query={query} onRunQuery={onRunQuery} onChange={onChange} />);

      const field = screen.getByTestId(TEST_IDS.queryEditor.fieldDate);

      expect(field).toHaveValue('pubDate');

      /**
       * OnChange
       */
      await act(() => fireEvent.change(field, { target: { value: 'date' } }));

      expect(onChange).toHaveBeenCalledWith({
        ...query,
        dateField: 'date',
      });
    });
  });
});
