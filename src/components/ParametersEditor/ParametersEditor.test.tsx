import React from 'react';
import { act, screen, render, fireEvent } from '@testing-library/react';
import { TestIds } from '../../constants';
import { ParametersEditor } from './ParametersEditor';

/**
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [] };
  const getComponent = ({ query = {}, ...restProps }: any) => {
    return <ParametersEditor {...restProps} query={query} />;
  };

  it('Should find component with Button', async () => {
    render(getComponent({ model }));

    expect(screen.getByTestId(TestIds.parametersEditor.buttonAdd)).toBeInTheDocument();
  });

  it('Should add new parameter', async () => {
    const onChange = jest.fn();
    const onRunQuery = jest.fn();
    render(getComponent({ model, onChange, onRunQuery }));

    await act(() => fireEvent.click(screen.getByTestId(TestIds.parametersEditor.buttonAdd)));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({
          '': '',
        }),
      })
    );
    expect(onRunQuery).toHaveBeenCalled();
  });
});
