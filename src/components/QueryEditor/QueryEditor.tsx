import { defaults } from 'lodash';
import React, { PureComponent } from 'react';
import { css } from '@emotion/css';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineFieldRow, InlineFormLabel, Select } from '@grafana/ui';
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
      <>
        <InlineFieldRow>
          <InlineFormLabel width={8}>Return</InlineFormLabel>
          <Select
            className={css`
              margin-right: 5px;
            `}
            width={40}
            options={FeedType}
            value={FeedType.find((type) => type.value === query.feedType)}
            onChange={this.onFeedTypeChange}
          />
        </InlineFieldRow>
      </>
    );
  }
}
