import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussRecentScreenProps } from '../navigation';

export default function DiscussRecentScreen({
  navigation,
}: DiscussRecentScreenProps) {
  return <DiscussScreen <'Recent'> navigation={navigation} />;
}
