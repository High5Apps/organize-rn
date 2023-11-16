import React, { useLayoutEffect, useMemo, useState } from 'react';
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
  const [graphRendered, setGraphRendered] = useState(false);

  useLayoutEffect(() => {
    const headerRight = () => <SettingsButton />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

  const ListHeaderComponent = useMemo(() => (
    <>
      <SectionHeader>Members and connections</SectionHeader>
      <OrgGraph
        onInteraction={(inProgress: boolean) => setScrollEnabled(!inProgress)}
        onRenderingProgressChanged={
          (progress) => setGraphRendered(progress >= 1)
        }
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
    </>
  ), [selectedUserId]);

  return (
    <ScreenBackground>
      <NotableUserList
        disableRows={!graphRendered}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={scrollEnabled}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
    </ScreenBackground>
  );
}
