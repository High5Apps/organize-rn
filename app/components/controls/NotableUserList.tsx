import React, {
  Dispatch, ReactElement, SetStateAction, useCallback, useMemo, useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent, ListRenderItem, SectionList, View,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { OrgGraph, User, useCurrentUser } from '../../model';
import useTheme from '../../Theme';
import { ItemSeparator, renderSectionHeader } from '../views';
import { usePullToRefresh } from '../hooks';
import UserRow from './UserRow';

type NotableUserSection = {
  title: string;
  data: User[];
};

type Props = {
  disableRows?: boolean;
  graphData?: OrgGraph;
  ListHeaderComponent?: ReactElement;
  officers: User[];
  onRefresh: () => Promise<any>;
  scrollEnabled?: boolean;
  selectedUserId?: string;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
};

export default function NotableUserList({
  disableRows, graphData, ListHeaderComponent, officers, onRefresh,
  scrollEnabled, selectedUserId, setSelectedUserId,
}: Props) {
  const [listHeaderComponentHeight, setListHeaderComponentHeight] = useState(0);

  const sectionListRef = useRef<SectionList<User, NotableUserSection>>(null);
  useScrollToTop(sectionListRef);

  const { colors } = useTheme();
  const { currentUser } = useCurrentUser();

  const onPress = useCallback(
    ({ id }: User) => {
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

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item }) => (
      <UserRow
        disabled={disableRows}
        isMe={currentUser?.id === item.id}
        item={item}
        onPress={onPress}
      />
    ),
    [onPress, disableRows],
  );

  if (!currentUser) {
    throw new Error('Expected current user to be set');
  }

  const sections: NotableUserSection[] = useMemo(() => {
    const notableUserSections: NotableUserSection[] = [];
    const users = graphData?.users;
    if (!users) { return notableUserSections; }

    if (selectedUserId) {
      const selectedOrgGraphUser = users[selectedUserId];
      const data = [selectedOrgGraphUser];
      notableUserSections.push({ title: 'Selected', data });
    }

    notableUserSections.push({ title: 'Officers', data: officers });

    const currentOrgGraphUser = users[currentUser.id];
    const { offices } = currentOrgGraphUser;
    const isOfficer = offices.length > 0;
    if (!isOfficer) {
      const meData = [currentOrgGraphUser];
      notableUserSections.push({ title: 'Me', data: meData });
    }

    return notableUserSections;
  }, [colors, currentUser, graphData, officers, selectedUserId]);

  const {
    ListHeaderComponent: PullToRefreshErrorMessage, refreshControl,
  } = usePullToRefresh({ onRefresh });

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
  graphData: undefined,
  ListHeaderComponent: undefined,
  scrollEnabled: true,
  selectedUserId: undefined,
};
