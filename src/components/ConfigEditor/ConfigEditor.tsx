import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { InlineField, InlineFieldRow, Input } from '@grafana/ui';
import React, { ChangeEvent, PureComponent } from 'react';

import { TEST_IDS } from '../../constants';
import { DataSourceOptions } from '../../types';

/**
 * Editor Properties
 */
type Props = DataSourcePluginOptionsEditorProps<DataSourceOptions>;

/**
 * Config Editor
 */
export class ConfigEditor extends PureComponent<Props, object> {
  /**
   * Feed URL Change
   */
  onFeedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        feed: event.target.value,
      },
    });
  };

  /**
   * Render
   */
  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <InlineFieldRow>
        <InlineField
          label="Feed URL"
          labelWidth={14}
          grow
          invalid={jsonData.feed === ''}
          tooltip={`The URL must be correct and contain all necessary characters ('/' at the end, etc.)`}
        >
          <Input
            type="text"
            value={jsonData.feed}
            onChange={this.onFeedChange}
            placeholder="https://feed"
            data-testid={TEST_IDS.configEditor.fieldUrl}
          />
        </InlineField>
      </InlineFieldRow>
    );
  }
}
