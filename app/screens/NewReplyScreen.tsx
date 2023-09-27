import React from 'react';
import type { NewReplyScreenProps } from '../navigation';
import { useComments } from '../model';
import { CommentRow } from '../components';
import NewCommentScreenBase from './NewCommentScreenBase';

export default function NewReplyScreen({ route }: NewReplyScreenProps) {
  const { params: { commentId } } = route;
  const { cacheComment, getCachedComment } = useComments();
  const comment = getCachedComment(commentId);

  if (comment === undefined) { return null; }

  const HeaderComponent = (
    <CommentRow
      disableDepthIndent
      hideTextButtonRow
      item={comment}
      onCommentChanged={cacheComment}
    />
  );

  return (
    <NewCommentScreenBase
      commentId={commentId}
      HeaderComponent={HeaderComponent}
    />
  );
}
