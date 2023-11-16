import React from 'react';
import { StyleSheet } from 'react-native';
import TextBoldener from './TextBoldener';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    bold: {
      fontFamily: font.weights.bold,
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

type Props = {
  asteriskDelimitedMessage: string;
};

export default function ListEmptyMessage({ asteriskDelimitedMessage }: Props) {
  const { styles } = useStyles();

  return (
    <TextBoldener
      boldStyle={styles.bold}
      baseStyle={styles.text}
      text={asteriskDelimitedMessage}
    />
  );
}
