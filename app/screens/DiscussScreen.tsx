import React from 'react';
import { StyleSheet } from 'react-native';
import { PostList, PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';
import type { DiscussScreenProps } from '../navigation';
import { usePostData } from '../model';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      bottom: spacing.m,
      end: spacing.m,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
      position: 'absolute',
    },
  });

  return { styles };
};

export default function DiscussScreen({ navigation }: DiscussScreenProps) {
  const { styles } = useStyles();

  const { posts, ready } = usePostData();

  return (
    <ScreenBackground>
      <PostList loading={!ready} posts={posts} />
      <PrimaryButton
        iconName="add"
        label="Post"
        onPress={() => navigation.navigate('NewPost')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
