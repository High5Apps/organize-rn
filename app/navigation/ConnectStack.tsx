import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectScreen, NewConnectionScreen } from '../screens';
import { ConnectStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions
  from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<ConnectStackParamList>();

export default function ConnectStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen component={ConnectScreen} name="Connect" />
      <Stack.Screen
        component={NewConnectionScreen}
        name="NewConnection"
        options={{ title: 'Create Connection' }}
      />
    </Stack.Navigator>
  );
}
