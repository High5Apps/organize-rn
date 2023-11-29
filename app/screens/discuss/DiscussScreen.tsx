import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import {
  ListEmptyMessage, PostList, PrimaryButton, ScreenBackground,
} from '../../components';
import useTheme from '../../Theme';
import type {
  DiscussTabsParamList, DiscussTabsScreenProps, InternalRoute,
} from '../../navigation';
import { Post, PostCategory, PostSort } from '../../model';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    contentContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

function useDiscussTabRoutes() {
  const [routes, setRoutes] = useState<InternalRoute[]>([]);

  useNavigationState((state) => {
    const { routes: currentRoutes } = state;
    if (currentRoutes !== routes) {
      setRoutes(currentRoutes);
    }
  });

  return routes;
}

type Props<T extends keyof DiscussTabsParamList> = {
  category?: PostCategory;
  emptyListMessage: string;
  navigation: DiscussTabsScreenProps<T>['navigation'];
  prependedPostIds?: string[];
  primaryButtonLabel: string;
  sort: PostSort;
};

export default function DiscussScreen<T extends keyof DiscussTabsParamList>({
  category, emptyListMessage, prependedPostIds, navigation, primaryButtonLabel,
  sort,
}: Props<T>) {
  const { styles } = useStyles();

  const discussTabRoutes = useDiscussTabRoutes();

  const onItemPress = useCallback(
    ({ id }: Post) => navigation.navigate('Post', { postId: id }),
    [navigation],
  );

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={emptyListMessage} />
  ), []);

  return (
    <ScreenBackground>
      <PostList
        category={category}
        contentContainerStyle={styles.contentContainerStyle}
        prependedPostIds={prependedPostIds}
        ListEmptyComponent={ListEmptyComponent}
        onItemPress={onItemPress}
        sort={sort}
      />
      <PrimaryButton
        iconName="add"
        label={primaryButtonLabel}
        onPress={() => navigation.navigate('NewPost', {
          category,
          discussTabRoutes,
        })}
        style={styles.button}
      />
    </ScreenBackground>
  );
}

DiscussScreen.defaultProps = {
  category: undefined,
  prependedPostIds: undefined,
};
