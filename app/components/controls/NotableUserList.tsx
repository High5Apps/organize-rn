import React, { ReactElement, useCallback } from 'react';
import {
  SectionList, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionHeader from '../views/SectionHeader';
import { useUserContext } from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
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
    },
    container: {
      backgroundColor: colors.fill,
      gap: spacing.xs,
      padding: spacing.m,
    },
    itemSeparator: {
      backgroundColor: colors.separator,
      height: sizes.separator,
      marginStart: spacing.m,
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.fill,
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
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    rowTitleText: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
      marginBottom: spacing.xs,
    },
  });

  return { colors, styles };
};

export type NotableUserItem = {
  user: {
    pseudonym: string;
  };
  circleColor: string;
  circleBorderColor?: string;
};

type NotableUserSection = {
  title: string;
  data: NotableUserItem[];
};

type SectionHeaderProps = {
  section: NotableUserSection;
};

type Props = {
  ListHeaderComponent?: ReactElement;
};

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  return <SectionHeader>{title}</SectionHeader>;
};

export default function NotableUserList({ ListHeaderComponent }: Props) {
  const { colors, styles } = useStyles();
  const { currentUser } = useUserContext();

  if (!currentUser) {
    throw new Error('Expected current user to be set');
  }

  const users = currentUser?.org?.graph?.users;
  const sections: NotableUserSection[] = [];
  if (users) {
    sections.push({
      title: 'Officers',
      data: [
        // TODO: Use real data
        { user: users[0], circleColor: '#0054FF' },
        { user: users[1], circleColor: '#00BFFF' },
        { user: users[2], circleColor: '#00FFFD' },
        { user: users[3], circleColor: '#54FF00' },
        { user: users[4], circleColor: '#FEFF00' },
        { user: users[5], circleColor: '#FFAB00' },
        { user: users[6], circleColor: '#FFAB00' },
        { user: users[7], circleColor: '#FFAB00' },
        { user: users[8], circleColor: '#FF0000' },
        { user: users[9], circleColor: '#FF00D0' },
      ],
    });
  }

  sections.push({
    title: 'Me',
    data: [
      {
        user: { pseudonym: currentUser.pseudonym },
        circleBorderColor: colors.primary,
        circleColor: colors.fill,
      },
    ],
  });

  const ItemSeparator = useCallback(() => (
    <View style={styles.itemSeparator} />
  ), [styles]);

  const renderItem = ({ item }: { item: NotableUserItem }) => {
    const {
      circleBorderColor, circleColor, user: { pseudonym },
    } = item;

    // TODO: Use real data
    const fakeTitle = 'Founder';
    const fakeTenure = '99w';
    const fakeConnectionCount = 10;
    const fakeRecruitCount = 7;

    return (
      <View style={styles.container}>
        <View style={styles.rowTitle}>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: circleColor,
                borderColor: circleBorderColor ?? circleColor,
              },
            ]}
          />
          <Text style={styles.rowTitleText}>{`${pseudonym}, ${fakeTitle}`}</Text>
        </View>
        <View style={styles.rowSubtitle}>
          <Icon name="schedule" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{fakeTenure}</Text>
          <Icon name="link" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{fakeConnectionCount}</Text>
          <Icon name="person-add-alt" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{fakeRecruitCount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
    />
  );
}

NotableUserList.defaultProps = {
  ListHeaderComponent: null,
};
