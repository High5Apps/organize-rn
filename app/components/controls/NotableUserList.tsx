import React, { ReactElement, useState } from 'react';
import {
  SectionList, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionHeader from '../views/SectionHeader';
import {
  OrgGraphUser, getCircleColors, getHighestRank, getTenure, useGraphData, useUserContext,
} from '../../model';
import useTheme from '../../Theme';
import { ItemSeparator } from '../views';

export function getOrderedOfficers(users: OrgGraphUser[]): OrgGraphUser[] {
  const officers = users.filter((user) => user.offices?.[0]);
  const ordererdOfficers = officers.sort((officer, otherOfficer) => (
    getHighestRank(officer.offices) - getHighestRank(otherOfficer.offices)
  ));
  return ordererdOfficers;
}

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
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
      marginBottom: spacing.xs,
    },
  });

  return { colors, styles };
};

export type NotableUserItem = {
  user: OrgGraphUser;
  circleBackgroundColor: string;
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
  scrollEnabled?: boolean;
  selectedUserId?: string;
};

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  return <SectionHeader>{title}</SectionHeader>;
};

export default function NotableUserList({
  ListHeaderComponent, scrollEnabled, selectedUserId,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const { colors, styles } = useStyles();
  const { currentUser } = useUserContext();

  if (!currentUser) {
    throw new Error('Expected current user to be set');
  }

  const { graphData, updateOrgData } = useGraphData();
  const users = graphData?.users;
  const sections: NotableUserSection[] = [];
  if (users) {
    if (selectedUserId) {
      const selectedOrgGraphUser = users[selectedUserId];
      const isMe = selectedUserId === currentUser.id;
      const data = [{
        user: selectedOrgGraphUser,
        ...getCircleColors({ colors, isMe, user: selectedOrgGraphUser }),
      }];
      sections.push({ title: 'Selected', data });
    }

    const orgGraphUsers = Object.values(users);
    const ordererdOfficers = getOrderedOfficers(orgGraphUsers);
    const officersData = ordererdOfficers.map((officer) => ({
      user: officer,
      ...getCircleColors({ colors, user: officer }),
    }));
    sections.push({ title: 'Officers', data: officersData });

    const currentOrgGraphUser = users[currentUser.id];
    const meData = [{
      user: currentOrgGraphUser,
      ...getCircleColors({ colors, isMe: true, user: currentOrgGraphUser }),
    }];
    sections.push({ title: 'Me', data: meData });
  }

  const renderItem = ({ item }: { item: NotableUserItem }) => {
    const {
      circleBorderColor, circleBackgroundColor, user: {
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
  };

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      nestedScrollEnabled
      onRefresh={async () => {
        setRefreshing(true);
        try {
          await updateOrgData();
        } catch (e) {
          console.error(e);
        }
        setRefreshing(false);
      }}
      refreshing={refreshing}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      scrollEnabled={scrollEnabled}
      sections={sections}
    />
  );
}

NotableUserList.defaultProps = {
  ListHeaderComponent: null,
  scrollEnabled: true,
  selectedUserId: undefined,
};
