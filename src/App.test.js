import React from 'react';
import {render, screen} from '@testing-library/react';
import store from './redux/store';
import {Provider} from 'react-redux';
import App from './App';

it('Main components must be here', () => {
  render(<Provider store={store}><App /></Provider>);

  expect(screen.getByText('Styles')).toBeInTheDocument();
  expect(screen.getByText('Artists')).toBeInTheDocument();
  expect(screen.getByText('Sort')).toBeInTheDocument();
});
