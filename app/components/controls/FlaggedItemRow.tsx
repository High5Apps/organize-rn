import React, { useMemo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FlaggedItem, getFlaggedItemIcon, truncateText } from '../../model';
import useTheme from '../../Theme';
import { DisclosureIcon } from '../views';

// This matches the max length for ballots and posts, but not comments, which is
// much longer.
const MAX_TITLE_LENGTH = 140;

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      gap: spacing.s,
      padding: spacing.m,

      // Without this, it seems like there's more space at end vs. start
      paddingEnd: spacing.s,
    },
    rowIcon: {
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
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  item: FlaggedItem;
  onPress?: (item: FlaggedItem) => void;
};

export default function FlaggedItemRow({ item, onPress }: Props) {
  const { category, flagCount, pseudonym } = item;

  const title = useMemo(
    () => truncateText({ maxLength: MAX_TITLE_LENGTH, text: item.title })
      // Replace whitespace with space to prevent newlines from affecting layout
      .replace(/\s/g, ' '),
    [item.title],
  );

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <View style={styles.rowTitle}>
          <Icon
            name={getFlaggedItemIcon(category)}
            style={[styles.rowIcon, styles.rowIconPrimary]}
          />
          <Text style={styles.rowTitleText}>{title}</Text>
          <DisclosureIcon />
        </View>
        <View style={styles.rowSubtitle}>
          <Icon name="flag" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{flagCount}</Text>
          <Icon name="edit-square" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{pseudonym}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

FlaggedItemRow.defaultProps = {
  onPress: () => null,
};
