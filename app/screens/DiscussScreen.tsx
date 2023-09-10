import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { PostList, PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';
import type {
  DiscussTabsParamList, DiscussTabsScreenProps,
} from '../navigation';
import { Post } from '../model';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const buttonMarin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMarin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMarin,
      end: buttonMarin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMarin,
      position: 'absolute',
    },
    listEndMessageStyle: {
      marginBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

type Props<T extends keyof DiscussTabsParamList> = {
  navigation: DiscussTabsScreenProps<T>['navigation'];
};

export default function DiscussScreen<T extends keyof DiscussTabsParamList>({
  navigation,
}: Props<T>) {
  const { styles } = useStyles();

  const onItemPress = useCallback(
    ({ id }: Post) => navigation.navigate('Post', { postId: id }),
    [navigation],
  );

  return (
    <ScreenBackground>
      <PostList
        listEndMessageStyle={styles.listEndMessageStyle}
        onItemPress={onItemPress}
      />
      <PrimaryButton
        iconName="add"
        label="Post"
        onPress={() => navigation.navigate('NewPost')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
