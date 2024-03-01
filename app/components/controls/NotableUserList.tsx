import React, {
  Dispatch, ReactElement, SetStateAction, useCallback, useMemo, useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent, ListRenderItem, SectionList, View,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { getCircleColors, useGraphData, useUserContext } from '../../model';
import useTheme from '../../Theme';
import { ItemSeparator, renderSectionHeader } from '../views';
import NotableUserRow, { type NotableUserItem } from './NotableUserRow';
import { usePullToRefresh } from '../hooks';

type NotableUserSection = {
  title: string;
  data: NotableUserItem[];
};

type Props = {
  disableRows?: boolean;
  ListHeaderComponent?: ReactElement;
  scrollEnabled?: boolean;
  selectedUserId?: string;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
};

export default function NotableUserList({
  disableRows, ListHeaderComponent, scrollEnabled, selectedUserId,
  setSelectedUserId,
}: Props) {
  const [listHeaderComponentHeight, setListHeaderComponentHeight] = useState(0);

  const sectionListRef = useRef<SectionList<NotableUserItem, NotableUserSection>>(null);
  useScrollToTop(sectionListRef);

  const { colors } = useTheme();
  const { currentUser } = useUserContext();

  const onPress = useCallback(
    ({ user: { id } }: NotableUserItem) => {
      sectionListRef.current?.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,

        // Without this, on Android, it would scroll to the top of the pressed
        // row instead of the top of the screen. It doesn't seem to be needed
        // on iOS.
        viewOffset: listHeaderComponentHeight,
      });
      setSelectedUserId(id);
    },
    [listHeaderComponentHeight, sectionListRef],
  );

  const renderItem: ListRenderItem<NotableUserItem> = useCallback(
    ({ item }) => (
      <NotableUserRow
        currentUserId={currentUser?.id}
        disabled={disableRows}
        item={item}
        onPress={onPress}
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
        ...getCircleColors({
          colors, isMe, offices: selectedOrgGraphUser.offices,
        }),
      }];
      notableUserSections.push({ title: 'Selected', data });
    }

    const orgGraphUsers = Object.values(users);
    const ordererdOfficers = orgGraphUsers.filter((user) => user.offices[0]);
    const officersData = ordererdOfficers.map((officer) => ({
      user: officer,
      ...getCircleColors({ colors, offices: officer.offices }),
    }));
    notableUserSections.push({ title: 'Officers', data: officersData });

    const currentOrgGraphUser = users[currentUser.id];
    const { offices } = currentOrgGraphUser;
    const isOfficer = offices && offices.length > 0;
    if (!isOfficer) {
      const meData = [{
        user: currentOrgGraphUser,
        ...getCircleColors({
          colors, isMe: true, offices: currentOrgGraphUser.offices,
        }),
      }];
      notableUserSections.push({ title: 'Me', data: meData });
    }

    return notableUserSections;
  }, [colors, currentUser, graphData, selectedUserId]);

  const {
    ListHeaderComponent: PullToRefreshErrorMessage, refreshControl,
  } = usePullToRefresh({
    onRefresh: async () => {
      setSelectedUserId(undefined);
      await updateOrgData();
    },
  });

  const WrappedListHeaderComponent = useMemo(() => (
    <View
      onLayout={(event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setListHeaderComponentHeight(height);
      }}
    >
      <PullToRefreshErrorMessage />
      {ListHeaderComponent}
    </View>
  ), [ListHeaderComponent, PullToRefreshErrorMessage]);

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={WrappedListHeaderComponent}
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
  scrollEnabled: true,
  selectedUserId: undefined,
};
