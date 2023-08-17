import React from 'react';
import { StyleSheet } from 'react-native';
import { PostList, PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';
import type { DiscussScreenProps } from '../navigation';

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

  return (
    <ScreenBackground>
      <PostList
        onItemPress={({ id }) => navigation.navigate('Post', { postId: id })}
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
