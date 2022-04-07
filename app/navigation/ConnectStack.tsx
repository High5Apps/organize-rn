import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectScreen } from '../screens';
import { ConnectStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<ConnectStackParamList>();

export default function ConnectStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen component={ConnectScreen} name="Connect" />
    </Stack.Navigator>
  );
}
