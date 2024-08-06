import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { LeaveOrgScreenProps } from '../../navigation';

export default function LeaveOrgScreen({ route }: LeaveOrgScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
