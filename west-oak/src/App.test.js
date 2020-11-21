import React from 'react';
import { getByText, render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const div = document.createElement('div')
  render(<App />, div)
  // const { getByText } = render(<App />);
  // const linkElement = getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});

describe("attributes", () => {
  test('renders tagline', () => {
    const { getByText } = render(<App />)
    // const linkElement = getByText(/Banking Made Easy/i)
    const linkElement = getByText('Banking Made Easy')
    expect(linkElement).toBeInTheDocument()
  })

})
