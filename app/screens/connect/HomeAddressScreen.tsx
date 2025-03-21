import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { HomeAddressScreenProps } from '../../navigation';

export default function HomeAddressScreen({ route }: HomeAddressScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
