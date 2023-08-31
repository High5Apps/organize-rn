import React, {
  ForwardedRef, ReactElement, forwardRef, useCallback, useMemo, useRef,
  useState,
} from 'react';
import { ListRenderItem, SectionList } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import SectionHeader from '../views/SectionHeader';
import {
  OrgGraphUser, getCircleColors, getHighestRank, useGraphData, useUserContext,
} from '../../model';
import useTheme from '../../Theme';
import { ItemSeparator } from '../views';
import NotableUserRow, { type NotableUserItem } from './NotableUserRow';
import useNotableUserListRef, { NotableUserListRef } from './NotableUserListRef';

export function getOrderedOfficers(users: OrgGraphUser[]): OrgGraphUser[] {
  const officers = users.filter((user) => user.offices?.[0]);
  const ordererdOfficers = officers.sort((officer, otherOfficer) => (
    getHighestRank(officer.offices) - getHighestRank(otherOfficer.offices)
  ));
  return ordererdOfficers;
}

export type NotableUserSection = {
  title: string;
  data: NotableUserItem[];
};

type SectionHeaderProps = {
  section: NotableUserSection;
};

type Props = {
  ListHeaderComponent?: ReactElement;
  listHeaderComponentHeight?: number;
  onRefresh?: () => void;
  onUserSelected?: (userId: string) => void;
  scrollEnabled?: boolean;
  selectedUserId?: string;
};

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  return <SectionHeader>{title}</SectionHeader>;
};

const NotableUserList = forwardRef((
  {
    ListHeaderComponent, listHeaderComponentHeight, onRefresh, onUserSelected,
    scrollEnabled, selectedUserId,
  }: Props,
  ref: ForwardedRef<NotableUserListRef>,
) => {
  const [refreshing, setRefreshing] = useState(false);

  const sectionListRef = useRef<SectionList<NotableUserItem, NotableUserSection>>(null);
  useNotableUserListRef(ref, sectionListRef, listHeaderComponentHeight);
  useScrollToTop(sectionListRef);

  const { colors } = useTheme();
  const { currentUser } = useUserContext();

  const onPress = useCallback(
    ({ user: { id } }: NotableUserItem) => onUserSelected?.(id),
    [onUserSelected],
  );

  const renderItem: ListRenderItem<NotableUserItem> = useCallback(
    ({ item }) => <NotableUserRow item={item} onPress={onPress} />,
    [onPress],
  );

  if (!currentUser) {
    throw new Error('Expected current user to be set');
  }

  const { graphData, updateOrgData } = useGraphData();
  const sections: NotableUserSection[] = useMemo(() => {
    const notableUserSections: NotableUserSection[] = [];
    const users = graphData?.users;
    if (!users) { return notableUserSections; }

    if (selectedUserId) {
      const selectedOrgGraphUser = users[selectedUserId];
      const isMe = selectedUserId === currentUser.id;
      const data = [{
        user: selectedOrgGraphUser,
        ...getCircleColors({ colors, isMe, user: selectedOrgGraphUser }),
      }];
      notableUserSections.push({ title: 'Selected', data });
    }

    const orgGraphUsers = Object.values(users);
    const ordererdOfficers = getOrderedOfficers(orgGraphUsers);
    const officersData = ordererdOfficers.map((officer) => ({
      user: officer,
      ...getCircleColors({ colors, user: officer }),
    }));
    notableUserSections.push({ title: 'Officers', data: officersData });

    const currentOrgGraphUser = users[currentUser.id];
    const meData = [{
      user: currentOrgGraphUser,
      ...getCircleColors({ colors, isMe: true, user: currentOrgGraphUser }),
    }];
    notableUserSections.push({ title: 'Me', data: meData });

    return notableUserSections;
  }, [currentUser, graphData, selectedUserId]);

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      nestedScrollEnabled
      onRefresh={async () => {
        onRefresh?.();
        setRefreshing(true);
        try {
          await updateOrgData();
        } catch (e) {
          console.error(e);
        }
        setRefreshing(false);
      }}
      ref={sectionListRef}
      refreshing={refreshing}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      scrollEnabled={scrollEnabled}
      sections={sections}
    />
  );
});

NotableUserList.defaultProps = {
  ListHeaderComponent: undefined,
  listHeaderComponentHeight: 0,
  onRefresh: () => {},
  onUserSelected: () => {},
  scrollEnabled: true,
  selectedUserId: undefined,
};

export default NotableUserList;
