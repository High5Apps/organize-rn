import React, {
  Dispatch, ReactElement, SetStateAction, useCallback, useMemo, useRef,
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
import usePullToRefresh from './PullToRefresh';

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
  disableRows?: boolean;
  ListHeaderComponent?: ReactElement;
  listHeaderComponentHeight?: number;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  selectedUserId?: string;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
};

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  return <SectionHeader>{title}</SectionHeader>;
};

export default function NotableUserList({
  disableRows, ListHeaderComponent, listHeaderComponentHeight, onRefresh,
  scrollEnabled, selectedUserId, setSelectedUserId,
}: Props) {
  const sectionListRef = useRef<SectionList<NotableUserItem, NotableUserSection>>(null);
  useScrollToTop(sectionListRef);

  const { colors } = useTheme();
  const { currentUser } = useUserContext();

  const onPress = useCallback(
    ({ user: { id } }: NotableUserItem) => {
      sectionListRef.current?.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        viewOffset: listHeaderComponentHeight,
      });
      setSelectedUserId(id);
    },
    [listHeaderComponentHeight, sectionListRef],
  );

  const renderItem: ListRenderItem<NotableUserItem> = useCallback(
    ({ item }) => (
      <NotableUserRow
        item={item}
        onPress={onPress}
        disabled={disableRows}
      />
    ),
    [onPress, disableRows],
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
  }, [colors, currentUser, graphData, selectedUserId]);

  const { refreshControl } = usePullToRefresh({
    onRefresh: async () => {
      onRefresh?.();
      try {
        await updateOrgData();
      } catch (e) {
        console.error(e);
      }
    },
  });

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      nestedScrollEnabled
      ref={sectionListRef}
      refreshControl={refreshControl}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      scrollEnabled={scrollEnabled}
      sections={sections}
    />
  );
}

NotableUserList.defaultProps = {
  disableRows: true,
  ListHeaderComponent: undefined,
  listHeaderComponentHeight: 0,
  onRefresh: () => {},
  scrollEnabled: true,
  selectedUserId: undefined,
};
