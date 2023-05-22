import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  IconButton, LockingScrollView, OrgGraph, ScreenBackground, SectionHeader,
} from '../components';
import type {
  OrgScreenProps, SettingsScreenNavigationProp,
} from '../navigation';
import useTheme from '../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    settingsButton: {
      marginEnd: spacing.m,
    },
  });

  return { styles };
};

function SettingsButton() {
  const navigation: SettingsScreenNavigationProp = useNavigation();
  const { styles } = useStyles();
  return (
    <IconButton
      iconName="settings"
      onPress={() => navigation.navigate('Settings')}
      style={styles.settingsButton}
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
