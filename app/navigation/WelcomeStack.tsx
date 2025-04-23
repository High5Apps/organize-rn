import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen, NewOrgScreen, OrgReview, JoinOrgScreen,
  VerificationScreen,
} from '../screens';
import type { WelcomeStackParamList } from './types';
import { SafeAreaPadding } from '../components';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import useTheme from '../Theme';
import { useCurrentUser } from '../model';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export default function WelcomeStack() {
  const defaultOptions = useDefaultStackNavigatorOptions();
  const { colors } = useTheme();
  const screenOptions = {
    ...defaultOptions,
    headerShown: false,
    navigationBarColor: colors.background,
  };

  const { currentUser } = useCurrentUser();
  const inVerification = currentUser?.org?.unverified;
  const initialRouteName = inVerification ? 'Verification' : 'Welcome';

  return (
    <SafeAreaPadding>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="NewOrg"
          component={NewOrgScreen}
          getId={({ params }) => String(params.step)}
          options={{ navigationBarColor: colors.fill }}
        />
        <Stack.Screen name="OrgReview" component={OrgReview} />
        <Stack.Screen
          name="JoinOrg"
          component={JoinOrgScreen}
        />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
        />
      </Stack.Navigator>
    </SafeAreaPadding>
  );
}
