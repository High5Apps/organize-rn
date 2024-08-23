import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { VerificationScreenProps } from '../../navigation';

export default function VerificationScreen({ route }: VerificationScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
