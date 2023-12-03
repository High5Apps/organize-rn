import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BallotScreen, BallotPreviewsScreen, BallotTypeScreen, NewYesNoBallotScreen,
  ResultScreen, NewMultipleChoiceBallotScreen,
} from '../screens';
import { VoteStackParamList } from './types';
import useDefaultStackNavigatorScreenOptions from './useDefaultStackNavigatorScreenOptions';

const Stack = createNativeStackNavigator<VoteStackParamList>();

export default function VoteStack() {
  const screenOptions = useDefaultStackNavigatorScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName="BallotPreviews"
    >
      <Stack.Screen component={BallotScreen} name="Ballot" />
      <Stack.Screen
        component={BallotPreviewsScreen}
        name="BallotPreviews"
        options={{ title: 'Vote' }}
      />
      <Stack.Screen
        component={BallotTypeScreen}
        name="BallotType"
        options={{ title: 'New Vote' }}
      />
      <Stack.Screen
        component={NewYesNoBallotScreen}
        name="NewYesOrNoBallot"
        options={{ title: 'Yes or No' }}
      />
      <Stack.Screen
        component={NewMultipleChoiceBallotScreen}
        name="NewMultipleChoiceBallot"
        options={{ title: 'Multiple Choice' }}
      />
      <Stack.Screen
        component={ResultScreen}
        name="Result"
        options={{ title: 'Results' }}
      />
    </Stack.Navigator>
  );
}
