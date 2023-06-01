import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestIds } from '../../constants';
import { ParametersEditor } from './ParametersEditor';

/**
 * Editor
 */
describe('Editor', () => {
  const model = { fields: [] };

  it('Should find component with Button', async () => {
    const getComponent = ({ query = {}, ...restProps }: any) => {
      return <ParametersEditor {...restProps} query={query} />;
    };

    render(getComponent({ model }));

    expect(screen.getByTestId(TestIds.parametersEditor.buttonAdd)).toBeInTheDocument();
  });
});
