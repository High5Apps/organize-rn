import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModerationEvent, getMessageAge } from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
    rowSubtitle: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    rowSubtitleText: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginEnd: spacing.m,
    },
    rowTitleText: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { styles };
};

type Props = {
  item: ModerationEvent;
};

export default function BlockedMemberRow({ item }: Props) {
  const { styles } = useStyles();

  const subtitle = `Blocked ${getMessageAge(item.createdAt)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.rowTitleText}>
        {item.moderatable.creator.pseudonym}
      </Text>
      <View style={styles.rowSubtitle}>
        <Text style={styles.rowSubtitleText}>{subtitle}</Text>
      </View>
    </View>
  );
}
