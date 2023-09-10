import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import LinkingConfig from './LinkingConfig';
import OrgTabs from './OrgTabs';
import WelcomeStack from './WelcomeStack';
import { useUserContext } from '../model';
import useTheme from '../Theme';

export default function Navigation() {
  const { colors: { background } } = useTheme();
  DefaultTheme.colors.background = background;

  const { currentUser } = useUserContext();

  return (
    <NavigationContainer linking={LinkingConfig}>
      {currentUser ? <OrgTabs /> : <WelcomeStack />}
    </NavigationContainer>
  );
}
