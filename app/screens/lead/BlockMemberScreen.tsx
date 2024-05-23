import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { BlockMemberScreenProps } from '../../navigation';

export default function BlockMemberScreen({ route }: BlockMemberScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
