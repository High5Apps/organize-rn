import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LinkingConfig from './LinkingConfig';
import { useNavigationTheme } from '../Theme';
import RootStack from './RootStack';

export default function Navigation() {
  const navigationTheme = useNavigationTheme();

  return (
    <NavigationContainer linking={LinkingConfig} theme={navigationTheme}>
      <RootStack />
    </NavigationContainer>
  );
}
