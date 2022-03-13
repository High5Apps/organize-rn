import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import CircleLogo from '../assets/images/CircleLogo';
import AutoscaledText from './AutoscaledText';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import Theme from './Theme';

const buttonHeight = 50;

const styles = StyleSheet.create({
  background: {
    backgroundColor: Theme.colors.background,
    flex: 1,
  },
  baseText: {
    color: Theme.colors.foreground,
    fontFamily: Theme.font.weights.regular,
  },
  button: {
    height: buttonHeight,
    marginHorizontal: Theme.spacing.s,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.m,
  },
  buttonRowScrollEnabled: {
    backgroundColor: Theme.colors.background,
    borderTopColor: Theme.colors.foregroundSecondary,
    borderTopWidth: 0.5,
  },
  scrollView: {
    flexGrow: 1,
    marginTop: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.m,
  },
  title: {
    fontFamily: Theme.font.weights.medium,
  },
});

export default function App() {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const { height: screenHeight } = useWindowDimensions();

  const onContentSizeChange = (_: number, contentHeight: number) => {
    const buttonRowHeight = buttonHeight + 4 * Theme.spacing.m;
    setScrollEnabled(contentHeight > screenHeight - buttonRowHeight);
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        onContentSizeChange={onContentSizeChange}
        style={styles.scrollView}
        scrollEnabled={scrollEnabled}
      >
        <CircleLogo />
        <AutoscaledText style={[styles.baseText, styles.title]}>
          Organize
        </AutoscaledText>
        <AutoscaledText style={styles.baseText}>
          Strength in Numbers
        </AutoscaledText>
      </ScrollView>
      <View
        style={[
          styles.buttonRow,
          scrollEnabled && styles.buttonRowScrollEnabled,
        ]}
      >
        <SecondaryButton
          iconName="add"
          label="Create Org"
          onPress={() => console.log('Create pressed!')}
          style={styles.button}
        />
        <PrimaryButton
          iconName="qr-code-2"
          label="Join Org"
          onPress={() => console.log('Join pressed!')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}
