import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import { useCurrentUser } from '../model';
import WelcomeStack from './WelcomeStack';
import OrgTabs from './OrgTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const defaultOptions = useDefaultStackNavigatorOptions();
  const screenOptions = {
    ...defaultOptions,
    headerShown: false,
  };

  const { currentUser } = useCurrentUser();
  const onboarding = !currentUser || currentUser.org.unverified;

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {onboarding ? (
        <Stack.Screen component={WelcomeStack} name="WelcomeStack" />
      ) : (
        <Stack.Screen component={OrgTabs} name="OrgTabs" />
      )}
    </Stack.Navigator>
  );
}
