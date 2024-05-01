import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen, NewOrgScreen, OrgReview, JoinOrgScreen,
} from '../screens';
import type { WelcomeStackParamList } from './types';
import { SafeAreaPadding, StatusBar } from '../components';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import useTheme from '../Theme';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export default function WelcomeStack() {
  const defaultOptions = useDefaultStackNavigatorOptions();
  const { colors } = useTheme();
  const screenOptions = {
    ...defaultOptions,
    headerShown: false,
    navigationBarColor: colors.background,
  };

  return (
    <StatusBar backgroundColor={colors.background}>
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
    </StatusBar>
  );
}
