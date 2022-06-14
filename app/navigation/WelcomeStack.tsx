import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen, NewOrgScreen, OrgReview, JoinOrgScreen,
} from '../screens';
import { WelcomeStackParamList } from './types';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export default function WelcomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="NewOrg"
        component={NewOrgScreen}
        getId={({ params }) => String(params.step)}
      />
      <Stack.Screen name="OrgReview" component={OrgReview} />
      <Stack.Screen
        name="JoinOrg"
        component={JoinOrgScreen}
        // The swipe back gesture is incompatible with the beforeRemove listener
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
