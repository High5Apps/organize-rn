import React, { useLayoutEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  IconButton, NotableUserList, NotableUserListRef, OrgGraph, OrgGraphRef,
  ScreenBackground, SectionHeader,
} from '../components';
import type {
  OrgScreenProps, SettingsScreenNavigationProp,
} from '../navigation';

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
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              ref={orgGraphRef}
            />
          </View>
        )}
        listHeaderComponentHeight={listHeaderComponentHeight}
        onRefresh={() => setSelectedUserId(undefined)}
        ref={notableUserList}
        scrollEnabled={scrollEnabled}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
    </ScreenBackground>
  );
}
