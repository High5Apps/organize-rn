import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../app/App';

test('renders correctly', async () => {
  render(<App />);
  const appNameTextComponent = await screen.findByText('Organize');
  expect(appNameTextComponent).toBeOnTheScreen();
});
