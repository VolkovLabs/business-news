import { defaults } from 'lodash';
import React, { ChangeEvent, PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { defaultQuery, FeedType, FeedTypeValue } from '../../constants';
import { DataSource } from '../../datasource';
import { DataSourceOptions, Query } from '../../types';

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
    onChange({ ...query, feedType: item.value! });
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
    const query = defaults(this.props.query, defaultQuery);

    return (
      <>
        <InlineFieldRow>
          <InlineField label="Return" labelWidth={8} grow={true}>
            <Select
              options={FeedType}
              value={FeedType.find((type) => type.value === query.feedType)}
              onChange={this.onFeedTypeChange}
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
            <Input type="text" value={query.dateField} onChange={this.onDateFieldChange} placeholder="pubDate" />
          </InlineField>
        </InlineFieldRow>
      </>
    );
  }
}
