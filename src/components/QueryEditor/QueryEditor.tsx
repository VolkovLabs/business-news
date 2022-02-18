import { defaults } from 'lodash';
import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Select } from '@grafana/ui';
import { FeedType, FeedTypeValue } from '../../constants';
import { DataSource } from '../../datasource';
import { DataSourceOptions, defaultQuery, Query } from '../../types';

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
   * Render
   */
  render() {
    const query = defaults(this.props.query, defaultQuery);

    return (
      <InlineFieldRow>
        <InlineField label="Return" labelWidth={8} grow={true}>
          <Select
            options={FeedType}
            value={FeedType.find((type) => type.value === query.feedType)}
            onChange={this.onFeedTypeChange}
          />
        </InlineField>
      </InlineFieldRow>
    );
  }
}
