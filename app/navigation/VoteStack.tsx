import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectScreen } from '../screens';
import { VoteStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<VoteStackParamList>();

export default function VoteStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Vote" component={ConnectScreen} />
    </Stack.Navigator>
  );
}
