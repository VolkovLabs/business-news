import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { CollapsableSection, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { defaults } from 'lodash';
import React, { ChangeEvent, PureComponent } from 'react';

import { DEFAULT_QUERY, FEED_TYPE, FeedTypeValue, TEST_IDS } from '../../constants';
import { DataSource } from '../../datasource';
import { DataSourceOptions, Query } from '../../types';
import { ParametersEditor } from '../ParametersEditor';

/**
 * Editor Properties
 */
type Props = QueryEditorProps<DataSource, Query, DataSourceOptions>;

/**
 * Query Editor
 */
export class QueryEditor extends PureComponent<Props> {
  /**
   * Feed Type change
   */
  onFeedTypeChange = async (item: SelectableValue<FeedTypeValue>) => {
    const { onChange, onRunQuery, query } = this.props;
    onChange({ ...query, feedType: item.value });
    onRunQuery();
  };

  /**
   * Date Field change
   */
  onDateFieldChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, onRunQuery, query } = this.props;
    onChange({ ...query, dateField: event.target.value });
    onRunQuery();
  };

  /**
   * Render
   */
  render() {
    const query = defaults(this.props.query, DEFAULT_QUERY);
    const { onChange, onRunQuery } = this.props;

    return (
      <>
        <InlineFieldRow>
          <InlineField label="Request" labelWidth={8} grow={true}>
            <Select
              options={FEED_TYPE}
              value={FEED_TYPE.find((type) => type.value === query.feedType)}
              onChange={this.onFeedTypeChange}
              aria-label={TEST_IDS.queryEditor.fieldFeedType}
            />
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField
            label="Filter by Date field"
            labelWidth={20}
            tooltip="Specify the date field's name to filter news in the time range."
            grow
          >
            <Input
              type="text"
              value={query.dateField}
              onChange={this.onDateFieldChange}
              placeholder="pubDate"
              data-testid={TEST_IDS.queryEditor.fieldDate}
            />
          </InlineField>
        </InlineFieldRow>

        <CollapsableSection label="URL Parameters" isOpen={true}>
          <ParametersEditor query={query} onChange={onChange} onRunQuery={onRunQuery} />
        </CollapsableSection>
      </>
    );
  }
}
