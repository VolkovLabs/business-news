import React, { ChangeEvent, PureComponent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { DataSourceOptions } from '../../types';

/**
 * Editor Properties
 */
interface Props extends DataSourcePluginOptionsEditorProps<DataSourceOptions> {}

/**
 * State
 */
interface State {}

/**
 * Config Editor
 */
export class ConfigEditor extends PureComponent<Props, State> {
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
        <InlineField label="Feed URL" labelWidth={14}>
          <Input type="text" value={jsonData.feed} width={40} onChange={this.onFeedChange} placeholder="https://feed" />
        </InlineField>
      </InlineFieldRow>
    );
  }
}
