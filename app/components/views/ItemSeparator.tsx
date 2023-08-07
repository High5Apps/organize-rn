import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    itemSeparator: {
      backgroundColor: colors.separator,
      height: sizes.separator,
      marginStart: spacing.m,
    },
  });

  return { styles };
};

export default function ItemSeparator() {
  const { styles } = useStyles();
  return <View style={styles.itemSeparator} />;
}
