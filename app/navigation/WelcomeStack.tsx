import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen, NewOrgScreen, OrgReview, JoinOrgScreen,
} from '../screens';
import type { WelcomeStackParamList } from './types';
import { SafeAreaPadding } from '../components';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export default function WelcomeStack() {
  return (
    <SafeAreaPadding>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
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
