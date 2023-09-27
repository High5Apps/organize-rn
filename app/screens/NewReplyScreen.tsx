import React from 'react';
import type { NewReplyScreenProps } from '../navigation';
import { useComments } from '../model';
import { CommentRow, KeyboardAvoidingScreenBackground } from '../components';

export default function NewReplyScreen({ route }: NewReplyScreenProps) {
  const { params: { commentId } } = route;
  const { cacheComment, getCachedComment } = useComments();
  const comment = getCachedComment(commentId);

  return (
    <KeyboardAvoidingScreenBackground>
      {comment && (
        <CommentRow
          disableDepthIndent
          disableReply
          item={comment}
          onCommentChanged={cacheComment}
        />
      )}
    </KeyboardAvoidingScreenBackground>
  );
}
