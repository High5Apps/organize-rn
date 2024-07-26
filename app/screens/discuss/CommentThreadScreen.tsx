import React from 'react';
import type { CommentThreadScreenProps } from '../../navigation';
import { CommentThreadList, ScreenBackground } from '../../components';

export default function CommentThreadScreen({
  route,
}: CommentThreadScreenProps) {
  const { commentId } = route.params;

  return (
    <ScreenBackground>
      <CommentThreadList commentId={commentId} />
    </ScreenBackground>
  );
}
