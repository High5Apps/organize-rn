import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGrievancesScreenProps } from '../navigation';

export default function DiscussGrievancesScreen({
  navigation,
}: DiscussGrievancesScreenProps) {
  return (
    <DiscussScreen <'Grievances'>
      navigation={navigation}
      primaryButtonLabel="Grievance"
    />
  );
}
