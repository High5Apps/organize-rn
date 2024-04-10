import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BallotScreen, BallotPreviewsScreen, BallotTypeScreen, NewYesNoBallotScreen,
  ResultScreen, NewMultipleChoiceBallotScreen, NewElectionBallotScreen,
  OfficeAvailabilityScreen, NominationsScreen, NewNominationScreen,
  NewCandidacyAnnouncementScreen,
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
        name="NewCandidacyAnnouncement"
        component={NewCandidacyAnnouncementScreen}
        options={{ title: 'New Candidacy Announcement' }}
      />
      <Stack.Screen
        component={NewElectionBallotScreen}
        name="NewElectionBallot"
        options={{ title: 'Election' }}
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
        component={NewNominationScreen}
        name="NewNomination"
        options={{
          headerShadowVisible: false,
          title: 'Nominate a Candidate',
        }}
      />
      <Stack.Screen
        component={NominationsScreen}
        name="Nominations"
        options={{ title: '' }}
      />
      <Stack.Screen
        component={OfficeAvailabilityScreen}
        name="OfficeAvailability"
        options={{ title: 'Election Office' }}
      />
      <Stack.Screen
        component={ResultScreen}
        name="Result"
        options={{ title: 'Results' }}
      />
    </Stack.Navigator>
  );
}
