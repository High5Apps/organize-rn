import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
  });

  return { styles };
};

export default function CommentRow() {
  const { styles } = useStyles();
  return <View style={styles.container} />;
}
