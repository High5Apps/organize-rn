import 'react-native';
import React from 'react';
import { act, create } from 'react-test-renderer';
import App from '../app/App';

it('renders correctly', async () => {
  await act(async () => {
    create(<App />);
  });
});
