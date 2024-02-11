import React from 'react';
import { OfficeList, ScreenBackground } from '../../components';
import type { OfficeTypeScreenProps } from '../../navigation';

export default function OfficeTypeScreen({
  navigation,
}: OfficeTypeScreenProps) {
  return (
    <ScreenBackground>
      <OfficeList
        onPress={({ type }) => {
          navigation.navigate('NewElectionBallot', { officeCategory: type });
        }}
      />
    </ScreenBackground>
  );
}
