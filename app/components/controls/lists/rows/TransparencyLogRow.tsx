import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getMessageAge, getModeratableIcon, type ModeratableType, type ModerationEvent,
} from '../../../../model';
import useTheme from '../../../../Theme';
import { DisclosureIcon } from '../../../views';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      paddingStart: spacing.m,
      paddingVertical: spacing.s,

      // Without this, it seems like there's more space at end vs. start
      paddingEnd: spacing.s,
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
  onPress?: (item: ModerationEvent) => void;
};

export default function TransparencyLogRow({ item, onPress }: Props) {
  const {
    action, createdAt, moderatable: { category, creator }, moderator,
  } = item;
  const isBlocked = action === 'block';
  const { t } = useTranslation();
  let title: string;
  if (category === 'User') {
    title = t(
      isBlocked
        ? 'explanation.transparencyLog.block.user'
        : 'explanation.transparencyLog.unblock.user',
      { pseudonym: creator.pseudonym, moderator: moderator.pseudonym },
    );
  } else {
    const key = category.toLowerCase() as Lowercase<ModeratableType>;
    title = t(
      [
        (isBlocked
          ? `explanation.transparencyLog.block.${key}`
          : `explanation.transparencyLog.unblock.${key}`),
        'explanation.transparencyLog.unknown',
      ],
      { moderator: moderator.pseudonym },
    );
  }
  const actionIcon = isBlocked ? 'block' : 'check';
  const timeAgo = getMessageAge(createdAt);

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <View style={styles.rowTitle}>
          <Icon
            name={getModeratableIcon(category)}
            style={[styles.rowIcon, styles.rowIconPrimary]}
          />
          <Text style={styles.rowTitleText}>{title}</Text>
          <DisclosureIcon />
        </View>
        <View style={styles.rowSubtitle}>
          <Icon name={actionIcon} style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{timeAgo}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}
