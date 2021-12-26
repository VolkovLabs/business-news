import { defaults } from 'lodash';
import React, { ChangeEvent, PureComponent } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { InlineField, InlineFieldRow, Input } from '@grafana/ui';
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
   * Query Text change
   */
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryText: event.target.value });
  };

  /**
   * Render
   */
  render() {
    const query = defaults(this.props.query, defaultQuery);

    return (
      <InlineFieldRow>
        <InlineField label="Query Text" labelWidth={14} grow>
          <Input type="text" value={query.queryText} onChange={this.onQueryTextChange} />
        </InlineField>
      </InlineFieldRow>
    );
  }
}
