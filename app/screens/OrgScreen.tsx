import React, { useLayoutEffect, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  IconButton, NotableUserList, OrgGraph, ScreenBackground, SectionHeader,
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
  const [graphRendered, setGraphRendered] = useState(false);

  useLayoutEffect(() => {
    const headerRight = () => <SettingsButton />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

  return (
    <ScreenBackground>
      <NotableUserList
        disableRows={!graphRendered}
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
              onRenderingProgressChanged={
                (progress) => setGraphRendered(progress >= 1)
              }
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
            />
          </View>
        )}
        listHeaderComponentHeight={listHeaderComponentHeight}
        scrollEnabled={scrollEnabled}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
    </ScreenBackground>
  );
}
