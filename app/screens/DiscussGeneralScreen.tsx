import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGeneralScreenProps } from '../navigation';

export default function DiscussGeneralScreen({
  navigation,
}: DiscussGeneralScreenProps) {
  return (
    <DiscussScreen <'General'>
      navigation={navigation}
      primaryButtonLabel="Discussion"
    />
  );
}
