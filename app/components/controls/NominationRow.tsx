import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import { Nomination } from '../../model';
import { HighlightedRowContainer } from '../views';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  item: Nomination;
};

export default function NominationRow({ item: { nominator, nominee } }: Props) {
  const { styles } = useStyles();

  return (
    <HighlightedRowContainer userIds={[nominator.id, nominee.id]}>
      <View style={styles.container}>
        <Text style={styles.title}>{nominee.pseudonym}</Text>
        <Text style={styles.subtitle}>
          {`Nominated by ${nominator.pseudonym}`}
        </Text>
      </View>
    </HighlightedRowContainer>
  );
}
