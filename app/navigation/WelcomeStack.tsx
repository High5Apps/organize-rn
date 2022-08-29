import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  WelcomeScreen, NewOrgScreen, OrgReview, JoinOrgScreen,
} from '../screens';
import type { WelcomeStackParamList } from './types';

const Stack = createStackNavigator<WelcomeStackParamList>();

export default function WelcomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ animationEnabled: false }}
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
  );
}
