import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LinkingConfig from './LinkingConfig';
import OrgTabs from './OrgTabs';
import WelcomeStack from './WelcomeStack';
import { useCurrentUser } from '../model';
import { useNavigationTheme } from '../Theme';

export default function Navigation() {
  const navigationTheme = useNavigationTheme();
  const { currentUser } = useCurrentUser();
  const onboarding = !currentUser || currentUser.org.unverified;

  return (
    <NavigationContainer linking={LinkingConfig} theme={navigationTheme}>
      {onboarding ? <WelcomeStack /> : <OrgTabs />}
    </NavigationContainer>
  );
}
