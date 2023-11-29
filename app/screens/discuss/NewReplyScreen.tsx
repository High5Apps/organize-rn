import React from 'react';
import type { NewReplyScreenProps } from '../../navigation';
import { useComments } from '../../model';
import { CommentRow } from '../../components';
import NewCommentScreenBase from './NewCommentScreenBase';

export default function NewReplyScreen({
  navigation, route,
}: NewReplyScreenProps) {
  const { params: { commentId, postId } } = route;
  const { cacheComment, getCachedComment } = useComments();
  const comment = getCachedComment(commentId);

  if (comment === undefined) { return null; }

  const HeaderComponent = (
    <CommentRow
      compactView
      disableDepthIndent
      enableBodyTextSelection
      hideTextButtonRow
      item={comment}
      onCommentChanged={cacheComment}
      postId={postId}
    />
  );

  return (
    <NewCommentScreenBase
      commentId={commentId}
      HeaderComponent={HeaderComponent}
      onCommentCreated={(newCommentId) => {
        navigation.navigate('Post', {
          insertedComments: [
            { commentId: newCommentId, parentCommentId: commentId },
          ],
          postId,
        });
      }}
    />
  );
}
