import React from 'react';
import { OfficeAvailabilityList, ScreenBackground } from '../../components';
import type { OfficeAvailabilityScreenProps } from '../../navigation';

export default function OfficeAvailabilityScreen({
  navigation,
}: OfficeAvailabilityScreenProps) {
  return (
    <ScreenBackground>
      <OfficeAvailabilityList
        onPress={({ type }) => {
          navigation.navigate('NewElectionBallot', { officeCategory: type });
        }}
      />
    </ScreenBackground>
  );
}
