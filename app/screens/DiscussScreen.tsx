import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import {
  PostList, PrimaryButton, ScreenBackground, TextBoldener,
} from '../components';
import useTheme from '../Theme';
import type {
  DiscussTabsParamList, DiscussTabsScreenProps,
} from '../navigation';
import { Post, PostCategory, PostSort } from '../model';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const buttonMarin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMarin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    bold: {
      fontFamily: font.weights.bold,
    },
    button: {
      bottom: buttonMarin,
      end: buttonMarin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMarin,
      position: 'absolute',
    },
    contentContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      margin: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props<T extends keyof DiscussTabsParamList> = {
  category?: PostCategory;
  emptyListMessage: string;
  navigation: DiscussTabsScreenProps<T>['navigation'];
  newPostCreatedAt?: number;
  newPostId?: string;
  primaryButtonLabel: string;
  sort: PostSort;
};

export default function DiscussScreen<T extends keyof DiscussTabsParamList>({
  category, emptyListMessage, navigation, newPostCreatedAt, newPostId,
  primaryButtonLabel, sort,
}: Props<T>) {
  const { styles } = useStyles();

  const onItemPress = useCallback(
    ({ id }: Post) => navigation.navigate('Post', { postId: id }),
    [navigation],
  );

  return (
    <ScreenBackground>
      <PostList
        category={category}
        contentContainerStyle={styles.contentContainerStyle}
        highlightedPostId={newPostId}
        ListEmptyComponent={(
          <TextBoldener
            boldStyle={styles.bold}
            baseStyle={styles.text}
            text={emptyListMessage}
          />
        )}
        newPostCreatedAt={newPostCreatedAt}
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

DiscussScreen.defaultProps = {
  category: undefined,
  newPostCreatedAt: undefined,
  newPostId: undefined,
};
