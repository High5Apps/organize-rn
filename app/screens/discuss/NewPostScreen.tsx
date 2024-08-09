import React, { useCallback } from 'react';
import type { Post, PostCategory } from '../../model';
import type {
  DiscussTabsParamList, NewPostScreenProps,
} from '../../navigation';
import NewPostScreenBase from './NewPostScreenBase';

type DisccussTabName = keyof DiscussTabsParamList;
function getNextScreenName(category?: PostCategory): DisccussTabName {
  if (category === 'general') { return 'General'; }
  if (category === 'demands') { return 'Demands'; }
  if (category === 'grievances') { return 'Grievances'; }
  return 'Recent';
}

export default function NewPostScreen({
  navigation, route,
}: NewPostScreenProps) {
  const { category: maybeCategory } = route.params ?? {};

  const onPostCreated = useCallback((post: Post) => {
    const params = { prependedPostId: post.id };
    const screen = getNextScreenName(maybeCategory);
    navigation.navigate('DiscussTabs', { screen, params });
  }, []);

  return (
    <NewPostScreenBase
      initialCategory={maybeCategory}
      onPostCreated={onPostCreated}
    />
  );
}
