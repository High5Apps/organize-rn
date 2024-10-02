import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  ListEmptyMessage, PostList, PrimaryButton, ScreenBackground,
} from '../../components';
import useTheme from '../../Theme';
import type {
  DiscussTabsParamList, DiscussTabsScreenProps,
} from '../../navigation';
import { Post, PostCategory, PostSort } from '../../model';
import useCorrespondingDiscussTabUpdater from './CorrespondingDiscussTabUpdater';

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

type Props<T extends keyof DiscussTabsParamList> = {
  category?: PostCategory;
  emptyListMessage: string;
  navigation: DiscussTabsScreenProps<T>['navigation'];
  prependedPostId?: string;
  primaryButtonLabel: string;
  screenName: keyof DiscussTabsParamList;
  sort: PostSort;
};

export default function DiscussScreen<T extends keyof DiscussTabsParamList>({
  category, emptyListMessage, prependedPostId, navigation, primaryButtonLabel,
  screenName, sort,
}: Props<T>) {
  const { styles } = useStyles();

  useCorrespondingDiscussTabUpdater(screenName, navigation, prependedPostId);

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
        prependedPostId={prependedPostId}
        ListEmptyComponent={ListEmptyComponent}
        onItemPress={onItemPress}
        sort={sort}
      />
      <PrimaryButton
        iconName="add"
        label={primaryButtonLabel}
        onPress={() => navigation.navigate('NewPost', { category })}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
