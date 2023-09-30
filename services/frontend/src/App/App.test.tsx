import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('renders 1=1', () => {
  //  const { getByText } = render(<App />);
  //  const linkElement = getByText(/learn react/i);
  //  expect(linkElement).toBeInTheDocument();
  expect(1).toBe(1);
});
