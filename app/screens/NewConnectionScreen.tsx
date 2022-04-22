import React from 'react';
import { NewConnectionScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function NewConnectionScreen({
  route,
}: NewConnectionScreenProps) {
  const { name } = route;
  return <PlaceholderScreen name={name} />;
}
