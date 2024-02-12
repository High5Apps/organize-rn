import React from 'react';
import type { OfficeDutiesScreenProps } from '../../navigation';
import { OfficeDutyList, ScreenBackground } from '../../components';

export default function OfficeDutiesScreen({
  route,
}: OfficeDutiesScreenProps) {
  const { officeCategory } = route.params;
  return (
    <ScreenBackground>
      <OfficeDutyList highlightedOffice={officeCategory} />
    </ScreenBackground>
  );
}
