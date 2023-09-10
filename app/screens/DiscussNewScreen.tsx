import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussNewScreenProps } from '../navigation';

export default function DiscussNewScreen({
  navigation,
}: DiscussNewScreenProps) {
  return <DiscussScreen <'New'> navigation={navigation} />;
}
