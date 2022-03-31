import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { WelcomeStack } from './navigation';

export default function App() {
  return (
    <NavigationContainer>
      <WelcomeStack />
    </NavigationContainer>
  );
}
