import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ConnectScreen, NewConnectionScreen, SettingsScreen } from '../screens';
import { ConnectStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions
  from './useDefaultStackNavigatorScreenOptions';

const Stack = createStackNavigator<ConnectStackParamList>();

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
      <Stack.Screen component={SettingsScreen} name="Settings" />
    </Stack.Navigator>
  );
}
