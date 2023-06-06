import React, { ReactElement, useCallback } from 'react';
import {
  SectionList, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionHeader from '../views/SectionHeader';
import {
  OrgGraphUser, getHighestRank, getTenure, useUserContext,
} from '../../model';
import useTheme from '../../Theme';

export function getOrderedOfficers(users: OrgGraphUser[]): OrgGraphUser[] {
  const officers = users.filter((user) => user.offices?.[0]);
  const ordererdOfficers = officers.sort((officer, otherOfficer) => (
    getHighestRank(officer.offices) - getHighestRank(otherOfficer.offices)
  ));
  return ordererdOfficers;
}

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
      marginTop: circlePadding,
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
      alignItems: 'flex-start',
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
  user: OrgGraphUser;
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
    const orgGraphUsers = Object.values(users);
    const ordererdOfficers = getOrderedOfficers(orgGraphUsers);
    const data = ordererdOfficers.map((officer) => {
      // TODO: Handle officers with multiple concurrent offices
      const officeName = officer.offices?.[0];
      const circleColor = officeName ? colors.office[officeName] : colors.primary;
      return {
        user: officer,
        circleColor,
      };
    });
    sections.push({ title: 'Officers', data });

    sections.push({
      title: 'Me',
      data: [
        {
          user: users[currentUser.id],
          circleBorderColor: colors.primary,
          circleColor: colors.fill,
        },
      ],
    });
  }

  const ItemSeparator = useCallback(() => (
    <View style={styles.itemSeparator} />
  ), [styles]);

  const renderItem = ({ item }: { item: NotableUserItem }) => {
    const {
      circleBorderColor, circleColor, user: {
        connectionCount, joinedAt, offices, pseudonym, recruitCount,
      },
    } = item;

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
                backgroundColor: circleColor,
                borderColor: circleBorderColor ?? circleColor,
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
