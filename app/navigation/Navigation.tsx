import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigationTheme } from '../Theme';
import RootStack from './RootStack';
import useLinkingConfig from './LinkingConfig';

export default function Navigation() {
  const navigationTheme = useNavigationTheme();
  const linkingConfig = useLinkingConfig();

  return (
    <NavigationContainer linking={linkingConfig} theme={navigationTheme}>
      <RootStack />
    </NavigationContainer>
  );
}
