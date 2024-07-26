import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { CommentThreadScreenProps } from '../../navigation';

export default function CommentThreadScreen({
  route,
}: CommentThreadScreenProps) {
  return <PlaceholderScreen name={route.name} />;
}
