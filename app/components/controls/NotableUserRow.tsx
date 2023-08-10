import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OrgGraphUser, getTenure } from '../../model';
import useTheme from '../../Theme';

export type NotableUserItem = {
  user: OrgGraphUser;
  circleBackgroundColor: string;
  circleBorderColor?: string;
};

const useStyles = () => {
  const {
    colors, font, shadows, sizes, spacing,
  } = useTheme();

  // Align with the clock icon below it
  const circlePadding = spacing.xxs;
  const circleSize = sizes.icon - 2 * circlePadding;

  const styles = StyleSheet.create({
    circle: {
      aspectRatio: 1,
      borderRadius: circleSize / 2,
      borderWidth: 2,
      height: circleSize,
      padding: circlePadding,
      marginLeft: circlePadding,
      marginTop: circlePadding,
      ...shadows.elevation4,
    },
    container: {
      backgroundColor: colors.fill,
      gap: spacing.xs,
      padding: spacing.m,
    },
    rowIcon: {
      color: colors.labelSecondary,
      fontSize: sizes.icon,
      marginEnd: spacing.xs,
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
    rowTitle: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    rowTitleText: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
      marginBottom: spacing.xs,
    },
  });

  return { styles };
};

type Props = {
  item: NotableUserItem;
};

export default function NotableUserRow({ item }: Props) {
  const {
    circleBorderColor, circleBackgroundColor, user: {
      connectionCount, joinedAt, offices, pseudonym, recruitCount,
    },
  } = item;

  const { styles } = useStyles();

  const tenure = getTenure(1000 * joinedAt);

  const joinedOffices = offices?.join('/');
  const title = [pseudonym, joinedOffices].filter((e) => e).join(', ');

  return (
    <View style={styles.container}>
      <View style={styles.rowTitle}>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: circleBackgroundColor,
              borderColor: circleBorderColor,
            },
          ]}
        />
        <Text style={styles.rowTitleText}>{title}</Text>
      </View>
      <View style={styles.rowSubtitle}>
        <Icon name="schedule" style={styles.rowIcon} />
        <Text style={styles.rowSubtitleText}>{tenure}</Text>
        <Icon name="link" style={styles.rowIcon} />
        <Text style={styles.rowSubtitleText}>{connectionCount}</Text>
        <Icon name="person-add-alt" style={styles.rowIcon} />
        <Text style={styles.rowSubtitleText}>{recruitCount}</Text>
      </View>
    </View>
  );
}
