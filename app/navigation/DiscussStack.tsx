import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscussScreen } from '../screens';
import { DiscussStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<DiscussStackParamList>();

export default function DiscussStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Discuss" component={DiscussScreen} />
    </Stack.Navigator>
  );
}