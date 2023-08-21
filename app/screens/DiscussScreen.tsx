import React from 'react';
import { StyleSheet } from 'react-native';
import { PostList, PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';
import type { DiscussScreenProps } from '../navigation';

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
  });

  return { buttonBoundingBoxHeight, styles };
};

export default function DiscussScreen({ navigation }: DiscussScreenProps) {
  const { buttonBoundingBoxHeight, styles } = useStyles();

  return (
    <ScreenBackground>
      <PostList
        onItemPress={({ id }) => navigation.navigate('Post', { postId: id })}
        paddingBottom={buttonBoundingBoxHeight}
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
