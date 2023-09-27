import React from 'react';
import type { NewCommentScreenProps } from '../navigation';
import { PostRow } from '../components';
import { usePosts } from '../model';
import NewCommentScreenBase from './NewCommentScreenBase';

export default function NewCommentScreen({ route }: NewCommentScreenProps) {
  const { params: { postId } } = route;
  const { cachePost, getCachedPost } = usePosts();
  const post = getCachedPost(postId);

  if (post === undefined) { return null; }

  const HeaderComponent = (
    <PostRow disabled item={post} onPostChanged={cachePost} />
  );

  return <NewCommentScreenBase HeaderComponent={HeaderComponent} post={post} />;
}
