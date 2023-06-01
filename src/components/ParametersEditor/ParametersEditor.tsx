import React from 'react';
import { Button, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { TestIds } from '../../constants';
import { Query } from '../../types';

/**
 * Properties
 */
interface Props {
  /**
   * Query
   *
   * @type {Query}
   */
  query: Query;

  /**
   * On Change
   */
  onChange: (value: Query) => void;

  /**
   * On Run Query
   */
  onRunQuery: () => void;
}

/**
 * Parameters Editor
 */
export const ParametersEditor = ({ query, onChange, onRunQuery }: Props) => {
  const params = query.params ? query.params : {};

  /**
   * Set Parameter
   */
  const setParameter = (key: string, value: string) => {
    params[key] = value;

    /**
     * Change
     */
    onChange({ ...query, params });
    onRunQuery();
  };

  /**
   * Remove Parameter
   */
  const removeParameters = (key: string) => {
    delete params[key];

    /**
     * Change
     */
    onChange({ ...query, params });
    onRunQuery();
  };

  return (
    <>
      {Object.keys(params).map((param, i) => {
        return (
          <InlineFieldRow key={i}>
            <InlineField label="Parameter" grow>
              <Input
                value={param}
                onChange={(e) => {
                  setParameter(e.currentTarget.value, params[param]);
                  removeParameters(param);
                }}
              />
            </InlineField>

            <InlineField label="Value" tooltip="Supports dashboard variables." grow>
              <Input
                value={params[param]}
                onChange={(e) => {
                  setParameter(param, e.currentTarget.value);
                }}
              />
            </InlineField>

            <InlineField>
              <Button
                variant="destructive"
                title="Remove"
                onClick={() => removeParameters(param)}
                icon="trash-alt"
                data-testid={TestIds.parametersEditor.buttonRemove}
              />
            </InlineField>
          </InlineFieldRow>
        );
      })}

      <InlineFieldRow>
        <InlineField>
          <Button
            variant="primary"
            title="Add a Parameter"
            onClick={() => setParameter('', '')}
            icon="plus"
            data-testid={TestIds.parametersEditor.buttonAdd}
          >
            Add a Parameter
          </Button>
        </InlineField>
      </InlineFieldRow>
    </>
  );
};
