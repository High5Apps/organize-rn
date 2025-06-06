import React, {
  Dispatch, ReactElement, SetStateAction, useCallback, useMemo, useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent, ListRenderItem, SectionList, View,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { User, useCurrentUser } from '../../../model';
import useTheme from '../../../Theme';
import { ItemSeparator } from '../../views';
import { UserRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import { renderSectionHeader } from '../SectionHeader';
import { useTranslation } from '../../../i18n';

type NotableUserSection = {
  title: string;
  data: User[];
};

type Props = {
  disableRows?: boolean;
  ListHeaderComponent?: ReactElement;
  officers: User[];
  onRefresh: () => Promise<any>;
  scrollEnabled?: boolean;
  selectedUser?: User;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
};

export default function NotableUserList({
  disableRows = true, ListHeaderComponent, officers, onRefresh,
  scrollEnabled = true, selectedUser, setSelectedUserId,
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

  const { t } = useTranslation();

  const sections: NotableUserSection[] = useMemo(() => {
    const notableUserSections: NotableUserSection[] = [];

    if (selectedUser) {
      const data = [selectedUser];
      notableUserSections.push({ title: t('modifier.selected'), data });
    }

    if (officers.length) {
      notableUserSections.push({ title: t('object.officers'), data: officers });
    }

    const currentOrgGraphUser = currentUser.user();
    const { offices } = currentOrgGraphUser;
    const isOfficer = offices.length > 0;
    if (!isOfficer) {
      const meData = [currentOrgGraphUser];
      notableUserSections.push({ title: t('object.me'), data: meData });
    }

    return notableUserSections;
  }, [colors, currentUser, officers, selectedUser, t]);

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
