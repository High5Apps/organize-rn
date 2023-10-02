import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import {
  PostList, PrimaryButton, ScreenBackground, TextBoldener,
} from '../components';
import useTheme from '../Theme';
import type {
  DiscussTabsParamList, DiscussTabsScreenProps, InternalRoute,
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
  insertedPostIds?: string[];
  primaryButtonLabel: string;
  sort: PostSort;
};

export default function DiscussScreen<T extends keyof DiscussTabsParamList>({
  category, emptyListMessage, insertedPostIds, navigation, primaryButtonLabel,
  sort,
}: Props<T>) {
  const { styles } = useStyles();

  const discussTabRoutes = useDiscussTabRoutes();

  const onItemPress = useCallback(
    ({ id }: Post) => navigation.navigate('Post', { postId: id }),
    [navigation],
  );

  return (
    <ScreenBackground>
      <PostList
        category={category}
        contentContainerStyle={styles.contentContainerStyle}
        insertedPostIds={insertedPostIds}
        ListEmptyComponent={(
          <TextBoldener
            boldStyle={styles.bold}
            baseStyle={styles.text}
            text={emptyListMessage}
          />
        )}
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
  insertedPostIds: undefined,
};
