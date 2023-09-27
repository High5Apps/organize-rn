import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';
import type { NewReplyScreenProps } from '../navigation';
import { useComments } from '../model';

export default function NewReplyScreen({ route }: NewReplyScreenProps) {
  const { name, params: { commentId } } = route;
  const { getCachedComment } = useComments();
  const comment = getCachedComment(commentId);
  console.log({ comment });

  return <PlaceholderScreen name={name} />;
}
