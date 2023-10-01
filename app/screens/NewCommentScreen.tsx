import React from 'react';
import type { NewCommentScreenProps } from '../navigation';
import { PostRow } from '../components';
import { usePosts } from '../model';
import NewCommentScreenBase from './NewCommentScreenBase';

export default function NewCommentScreen({
  navigation, route,
}: NewCommentScreenProps) {
  const { params: { postId } } = route;
  const { cachePost, getCachedPost } = usePosts();
  const post = getCachedPost(postId);

  if (post === undefined) { return null; }

  const HeaderComponent = (
    <PostRow
      disabled
      enableBodyTextSelection
      item={post}
      onPostChanged={cachePost}
    />
  );

  return (
    <NewCommentScreenBase
      HeaderComponent={HeaderComponent}
      onCommentCreated={(commentId) => {
        navigation.navigate('Post', {
          insertedComments: [{ commentId }],
          postId: post.id,
        });
      }}
      postId={postId}
    />
  );
}
