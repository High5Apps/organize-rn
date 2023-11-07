import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BallotsScreen, BallotTypeScreen } from '../screens';
import { VoteStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<VoteStackParamList>();

export default function VoteStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        component={BallotsScreen}
        name="Ballots"
        options={{ title: 'Vote' }}
      />
      <Stack.Screen
        component={BallotTypeScreen}
        name="BallotType"
        options={{ title: 'New Vote' }}
      />
    </Stack.Navigator>
  );
}
