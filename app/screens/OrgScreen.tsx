import React from 'react';
import { OrgScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function OrgScreen({ route }: OrgScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
