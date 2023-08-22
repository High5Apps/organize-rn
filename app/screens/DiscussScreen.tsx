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
    listEndMessageStyle: {
      marginBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function DiscussScreen({ navigation }: DiscussScreenProps) {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <PostList
        listEndMessageStyle={styles.listEndMessageStyle}
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
