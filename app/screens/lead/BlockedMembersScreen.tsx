import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { BlockedMembersScreenProps } from '../../navigation';

export default function BlockedMembersScreen({
  route,
}: BlockedMembersScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
