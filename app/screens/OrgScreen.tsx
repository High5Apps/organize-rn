import React, {
  useCallback, useLayoutEffect, useRef, useState,
} from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  DEFAULT_FOCUS_OPTIONS, IconButton, NotableUserList, NotableUserListRef,
  OrgGraph, ScreenBackground, SectionHeader,
} from '../components';
import type {
  OrgScreenProps, SettingsScreenNavigationProp,
} from '../navigation';
import { OrgGraphRef } from '../model';

function SettingsButton() {
  const navigation: SettingsScreenNavigationProp = useNavigation();
  return (
    <IconButton
      iconName="settings"
      onPress={() => navigation.navigate('Settings')}
    />
  );
}

export default function OrgScreen({ navigation }: OrgScreenProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [listHeaderComponentHeight, setListHeaderComponentHeight] = useState(0);

  useLayoutEffect(() => {
    const headerRight = () => <SettingsButton />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

  const orgGraphRef = useRef<OrgGraphRef>(null);
  const notableUserList = useRef<NotableUserListRef>(null);

  const onUserSelected = useCallback((userId: string) => {
    notableUserList.current?.scrollToTop();
    setSelectedUserId(userId);
    orgGraphRef.current?.focus(userId, DEFAULT_FOCUS_OPTIONS);
  }, [notableUserList.current, orgGraphRef.current]);

  return (
    <ScreenBackground>
      <NotableUserList
        ListHeaderComponent={(
          <View
            onLayout={(event: LayoutChangeEvent) => {
              const { height } = event.nativeEvent.layout;
              setListHeaderComponentHeight(height);
            }}
          >
            <SectionHeader>Members and connections</SectionHeader>
            <OrgGraph
              onInteraction={
                (inProgress: boolean) => setScrollEnabled(!inProgress)
              }
              onUserSelected={setSelectedUserId}
              ref={orgGraphRef}
            />
          </View>
        )}
        listHeaderComponentHeight={listHeaderComponentHeight}
        onRefresh={() => setSelectedUserId(undefined)}
        onUserSelected={onUserSelected}
        ref={notableUserList}
        scrollEnabled={scrollEnabled}
        selectedUserId={selectedUserId}
      />
    </ScreenBackground>
  );
}
