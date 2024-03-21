import React, { useCallback, useLayoutEffect } from 'react';
import { NewPostScreenBase } from '../../components';
import type { Post, PostCategory } from '../../model';
import type {
  DiscussTabsParamList, NewPostScreenProps,
} from '../../navigation';

function usePageTitleUpdater(
  navigation: NewPostScreenProps['navigation'],
  maybeCategory?: PostCategory,
) {
  useLayoutEffect(() => {
    let title: string = 'New Discussion';

    if (maybeCategory === 'demands') {
      title = 'New Demand';
    } else if (maybeCategory === 'general') {
      title = 'New General Discussion';
    } else if (maybeCategory === 'grievances') {
      title = 'New Grievance';
    }

    navigation.setOptions({ title });
  }, [navigation, maybeCategory]);
}

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
  usePageTitleUpdater(navigation, maybeCategory);

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
