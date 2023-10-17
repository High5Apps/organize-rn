import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen, NewOrgScreen, OrgReview, JoinOrgScreen,
} from '../screens';
import type { WelcomeStackParamList } from './types';
import { SafeAreaPadding } from '../components';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';
import useTheme from '../Theme';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export default function WelcomeStack() {
  const defaultOptions = useDefaultStackNavigatorScreenOptions();
  const { colors } = useTheme();
  const screenOptions = {
    ...defaultOptions,
    headerShown: false,
    navigationBarColor: colors.background,
  };

  return (
    <SafeAreaPadding>
      <Stack.Navigator
        initialRouteName="Welcome"
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
      </Stack.Navigator>
    </SafeAreaPadding>
  );
}
