import React from 'react';
import type { PostScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function PostScreen({ route }: PostScreenProps) {
  const { name, params: { postId } } = route;
  console.log({ postId });
  return <PlaceholderScreen name={name} />;
}
