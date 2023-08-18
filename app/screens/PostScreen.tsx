import React, { useLayoutEffect } from 'react';
import type { PostScreenProps } from '../navigation';
import PlaceholderScreen from './PlaceholderScreen';
import { usePostData } from '../model';

function toTitleCase(s: string) {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export default function PostScreen({ navigation, route }: PostScreenProps) {
  const { name, params: { postId } } = route;

  const { getCachedPost } = usePostData();
  const post = getCachedPost(postId);

  useLayoutEffect(() => {
    if (!post) { return; }

    const { category } = post;
    const capitalizedCategory = toTitleCase(category);
    navigation.setOptions({ title: capitalizedCategory });
  }, [navigation, post]);

  return <PlaceholderScreen name={name} />;
}
