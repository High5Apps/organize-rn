import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ConnectScreen, NewConnectionScreen, UnionCardScreen,
} from '../screens';
import { ConnectStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';

const Stack = createNativeStackNavigator<ConnectStackParamList>();

export default function ConnectStack() {
  const screenOptions = useDefaultStackNavigatorOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen component={ConnectScreen} name="Connect" />
      <Stack.Screen
        component={NewConnectionScreen}
        name="NewConnection"
        options={{ title: 'Create Connection' }}
      />
      <Stack.Screen
        component={UnionCardScreen}
        name="UnionCard"
        options={{ title: 'Union Card' }}
      />
    </Stack.Navigator>
  );
}
