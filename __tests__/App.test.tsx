import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../app/App';

test('renders correctly', async () => {
  render(<App />);
  await waitFor(() => screen);
});
