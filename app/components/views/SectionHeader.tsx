import React from 'react';
import { StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    text: {
      backgroundColor: colors.background,
      color: colors.label,
      fontFamily: font.weights.semiBold,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.xs,
    },
  });

  return { styles };
};

type Props = {
  children: string;
};

export default function SectionHeader({ children }: Props) {
  const { styles } = useStyles();

  return <Text style={styles.text}>{children}</Text>;
}
