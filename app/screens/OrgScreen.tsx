import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  IconButton, LockingScrollView, OrgGraph, ScreenBackground, SectionHeader,
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
  const headerRight = () => <SettingsButton />;

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation]);

  return (
    <ScreenBackground>
      <LockingScrollView>
        <SectionHeader>Members and connections</SectionHeader>
        <OrgGraph />
        <SectionHeader>Officers</SectionHeader>
      </LockingScrollView>
    </ScreenBackground>
  );
}
