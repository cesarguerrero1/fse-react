import React from 'react'
import { render, screen } from '@testing-library/react';
import App from "./App.js"
import '@testing-library/jest-dom'

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home Screen/i);
  expect(linkElement).toBeInTheDocument();
});
