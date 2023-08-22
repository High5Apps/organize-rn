import React from 'react';
import type { NewCommentScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';

export default function NewCommentScreen({ route }: NewCommentScreenProps) {
  const { name, params: { postId } } = route;

  console.log({ postId });

  return <PlaceholderScreen name={name} />;
}
