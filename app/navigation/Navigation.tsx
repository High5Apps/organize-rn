import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LinkingConfig from './LinkingConfig';
import OrgTabs from './OrgTabs';
import WelcomeStack from './WelcomeStack';
import { useUserContext } from '../model';

export default function Navigation() {
  const { currentUser } = useUserContext();
  return (
    <NavigationContainer linking={LinkingConfig}>
      {currentUser ? <OrgTabs /> : <WelcomeStack />}
    </NavigationContainer>
  );
}
