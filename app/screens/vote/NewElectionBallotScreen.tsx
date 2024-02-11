import React from 'react';
import { Text } from 'react-native';
import type { NewElectionBallotScreenProps } from '../../navigation';
import { ScreenBackground } from '../../components';

export default function NewElectionBallotScreen({
  route,
}: NewElectionBallotScreenProps) {
  const { officeCategory } = route.params;
  return (
    <ScreenBackground>
      <Text>{officeCategory}</Text>
    </ScreenBackground>
  );
}
