import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMessageAge, getModeratableIcon, type ModerationEvent } from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
    },
    rowIcon: {
      alignSelf: 'flex-start',
      color: colors.labelSecondary,
      fontSize: sizes.icon,
      marginEnd: spacing.xs,
    },
    rowIconPrimary: {
      color: colors.primary,
    },
    rowSubtitle: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    rowSubtitleText: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginEnd: spacing.s,
    },
    rowTitle: {
      // This must be flex-start instead of center to accomodate for titles that
      // take multiple lines
      alignItems: 'flex-start',

      flexDirection: 'row',
      gap: spacing.xs,
    },
    rowTitleText: {
      color: colors.label,
      flex: 1,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  item: ModerationEvent;
};

export default function TransparencyLogRow({
  item: {
    action, createdAt, moderatable: { category, creator }, moderator,
  },
}: Props) {
  const isBlocked = action === 'block';
  const pastAction = isBlocked ? 'blocked' : 'stopped blocking';
  let object: string;
  if (category === 'Post') {
    object = 'a discussion';
  } else if (category === 'User') {
    object = creator.pseudonym;
  } else {
    object = `a ${category.toLowerCase()}`;
  }
  const title = `${moderator.pseudonym} ${pastAction} ${object}`;
  const actionIcon = isBlocked ? 'block' : 'check';
  const timeAgo = getMessageAge(createdAt);

  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.rowTitle}>
        <Icon
          name={getModeratableIcon(category)}
          style={[styles.rowIcon, styles.rowIconPrimary]}
        />
        <Text style={styles.rowTitleText}>{title}</Text>
      </View>
      <View style={styles.rowSubtitle}>
        <Icon name={actionIcon} style={styles.rowIcon} />
        <Text style={styles.rowSubtitleText}>{timeAgo}</Text>
      </View>
    </View>
  );
}
