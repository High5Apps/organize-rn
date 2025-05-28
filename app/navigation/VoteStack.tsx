import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BallotScreen, BallotPreviewsScreen, BallotTypeScreen, NewYesNoBallotScreen,
  ResultScreen, NewMultipleChoiceBallotScreen, NewElectionBallotScreen,
  OfficeAvailabilityScreen, NominationsScreen, NewNominationScreen,
  NewCandidacyAnnouncementScreen,
} from '../screens';
import { VoteStackParamList } from './types';
import useDefaultStackNavigatorOptions from './DefaultStackNavigatorOptions';
import { useTranslation } from '../i18n';

const Stack = createNativeStackNavigator<VoteStackParamList>();

export default function VoteStack() {
  const screenOptions = useDefaultStackNavigatorOptions();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="BallotPreviews"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        component={BallotScreen}
        name="Ballot"
        options={{ title: t('object.ballot') }}
      />
      <Stack.Screen
        component={BallotPreviewsScreen}
        name="BallotPreviews"
        options={{ title: t('action.vote') }}
      />
      <Stack.Screen
        component={BallotTypeScreen}
        name="BallotType"
        options={{ title: t('object.new.vote') }}
      />
      <Stack.Screen
        component={NewCandidacyAnnouncementScreen}
        name="NewCandidacyAnnouncement"
        options={{ title: t('object.new.candidacyAnnouncement') }}
      />
      <Stack.Screen
        component={NewElectionBallotScreen}
        name="NewElectionBallot"
        options={{ title: t('object.ballotType.election') }}
      />
      <Stack.Screen
        component={NewYesNoBallotScreen}
        name="NewYesOrNoBallot"
        options={{ title: t('object.ballotType.yesOrNo') }}
      />
      <Stack.Screen
        component={NewMultipleChoiceBallotScreen}
        name="NewMultipleChoiceBallot"
        options={{ title: t('object.ballotType.multipleChoice') }}
      />
      <Stack.Screen
        component={NewNominationScreen}
        name="NewNomination"
        options={{
          headerShadowVisible: false,
          title: t('action.nominateCandidate'),
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
        options={{ title: t('object.electionOffice') }}
      />
      <Stack.Screen
        component={ResultScreen}
        name="Result"
        options={{ title: t('object.results') }}
      />
    </Stack.Navigator>
  );
}
