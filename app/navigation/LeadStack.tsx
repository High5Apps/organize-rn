import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LeadStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';
import { LeadScreen, PermissionsScreen } from '../screens';

const Stack = createNativeStackNavigator<LeadStackParamList>();

export default function LeadStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Lead" component={LeadScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
    </Stack.Navigator>
  );
}
