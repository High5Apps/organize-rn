import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussDemandsScreenProps } from '../navigation';

export default function DiscussDemandsScreen({
  navigation,
}: DiscussDemandsScreenProps) {
  return (
    <DiscussScreen <'Demands'>
      navigation={navigation}
      primaryButtonLabel="Demand"
    />
  );
}
