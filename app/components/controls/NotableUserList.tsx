import React, { ReactElement, useState } from 'react';
import { SectionList } from 'react-native';
import SectionHeader from '../views/SectionHeader';
import {
  OrgGraphUser, getCircleColors, getHighestRank, useGraphData, useUserContext,
} from '../../model';
import useTheme from '../../Theme';
import { ItemSeparator } from '../views';
import NotableUserRow, { type NotableUserItem } from './NotableUserRow';

export function getOrderedOfficers(users: OrgGraphUser[]): OrgGraphUser[] {
  const officers = users.filter((user) => user.offices?.[0]);
  const ordererdOfficers = officers.sort((officer, otherOfficer) => (
    getHighestRank(officer.offices) - getHighestRank(otherOfficer.offices)
  ));
  return ordererdOfficers;
}

type NotableUserSection = {
  title: string;
  data: NotableUserItem[];
};

type SectionHeaderProps = {
  section: NotableUserSection;
};

type Props = {
  ListHeaderComponent?: ReactElement;
  onUserSelected?: (userId: string) => void;
  scrollEnabled?: boolean;
  selectedUserId?: string;
};

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  return <SectionHeader>{title}</SectionHeader>;
};

export default function NotableUserList({
  ListHeaderComponent, onUserSelected, scrollEnabled, selectedUserId,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const { colors } = useTheme();
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

  const renderItem = ({ item }: { item: NotableUserItem }) => (
    <NotableUserRow
      item={item}
      onPress={({ user: { id } }: NotableUserItem) => onUserSelected?.(id)}
    />
  );

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
  onUserSelected: () => {},
  scrollEnabled: true,
  selectedUserId: undefined,
};
