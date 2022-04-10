import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrgScreen } from '../screens';
import { OrgStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<OrgStackParamList>();

export default function OrgStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Org" component={OrgScreen} />
    </Stack.Navigator>
  );
}
