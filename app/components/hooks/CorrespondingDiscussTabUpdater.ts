import { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { CommonActions, useNavigationState } from '@react-navigation/native';
import type {
  DiscussTabsParamList, DiscussTabsScreenProps,
} from '../../navigation';
import { usePosts } from '../../model';

type InternalRoute = {
  key: string,
  name: string,
};

function useDiscussTabRoutes() {
  const [routes, setRoutes] = useState<InternalRoute[]>([]);

  useNavigationState((state) => {
    const { routes: currentRoutes } = state;
    if (!isEqual(currentRoutes, routes)) {
      setRoutes(currentRoutes);
    }
  });

  return routes;
}

export default function useCorrespondingDiscussTabUpdater<
  T extends keyof DiscussTabsParamList,
>(
  screenName: keyof DiscussTabsParamList,
  navigation: DiscussTabsScreenProps<T>['navigation'],
  prependedPostId?: string,
) {
  const { getCachedPost } = usePosts();
  const discussTabRoutes = useDiscussTabRoutes();

  useEffect(() => {
    const firstPrependedPostCategory = getCachedPost(prependedPostId)?.category;
    if (firstPrependedPostCategory === undefined) { return; }

    let screenNameToUpdate: (keyof DiscussTabsParamList);
    if (firstPrependedPostCategory === 'demands') {
      screenNameToUpdate = 'Demands';
    } else if (firstPrependedPostCategory === 'general') {
      screenNameToUpdate = 'General';
    } else if (firstPrependedPostCategory === 'grievances') {
      screenNameToUpdate = 'Grievances';
    } else {
      console.warn('Unexpected post category');
      return;
    }

    if (screenName === screenNameToUpdate) {
      screenNameToUpdate = 'Recent';
    }

    const key = discussTabRoutes
      .find(({ name }) => (name === screenNameToUpdate))?.key;
    if (key) {
      navigation.dispatch({
        ...CommonActions.setParams({ prependedPostId }),
        source: key,
      });
    }
  }, [prependedPostId]);
}
