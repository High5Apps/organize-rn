import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import CircleLogo from '../assets/images/CircleLogo';
import AutoscaledText from './AutoscaledText';
import Theme from './Theme';

const styles = StyleSheet.create({
  background: {
    backgroundColor: Theme.colors.background,
    flex: 1,
    padding: Theme.spacing.m,
  },
  baseText: {
    color: Theme.colors.foreground,
    fontFamily: Theme.fontSize.regular,
  },
  title: {
    fontFamily: Theme.fontSize.medium,
  },
});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.background}
      >
        <CircleLogo />
        <AutoscaledText style={[styles.baseText, styles.title]}>
          Organize
        </AutoscaledText>
        <AutoscaledText style={styles.baseText}>
          Strength in Numbers
        </AutoscaledText>
      </ScrollView>
    </SafeAreaView>
  );
}
