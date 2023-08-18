import React, { useLayoutEffect } from 'react';
import { CommentList, ScreenBackground } from '../components';
import type { PostScreenProps } from '../navigation';
import { usePostData } from '../model';
import PostWithBody from '../components/controls/PostWithBody';

function toTitleCase(s: string) {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export default function PostScreen({ navigation, route }: PostScreenProps) {
  const { params: { postId } } = route;

  const { getCachedPost } = usePostData();
  const post = getCachedPost(postId);

  useLayoutEffect(() => {
    if (!post) { return; }

    const { category } = post;
    const capitalizedCategory = toTitleCase(category);
    navigation.setOptions({ title: capitalizedCategory });
  }, [navigation, post]);

  return (
    <ScreenBackground>
      <CommentList ListHeaderComponent={<PostWithBody post={post} />} />
    </ScreenBackground>
  );
}
