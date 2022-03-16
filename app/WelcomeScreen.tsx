import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import CircleLogo from '../assets/images/CircleLogo';
import AutoscaledText from './AutoscaledText';
import PrimaryButton from './PrimaryButton';
import ScreenBackground from './ScreenBackground';
import SecondaryButton from './SecondaryButton';
import useTheme from './Theme';
import { RootStackParamList } from './types';

const buttonHeight = 50;

const useStyles = () => {
  const theme = useTheme();

  const buttonRowHeight = buttonHeight + 4 * theme.spacing.m;

  const styles = StyleSheet.create({
    button: {
      height: buttonHeight,
      marginHorizontal: theme.spacing.s,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.s,
      paddingVertical: theme.spacing.m,
    },
    buttonRowScrollEnabled: {
      backgroundColor: theme.colors.background,
      borderTopColor: theme.colors.separator,
      borderTopWidth: 0.5,
    },
    scrollView: {
      flexGrow: 1,
      marginTop: theme.spacing.m,
      paddingHorizontal: theme.spacing.m,
    },
    subtitle: {
      color: theme.colors.labelSecondary,
      fontFamily: theme.font.weights.regular,
    },
    title: {
      color: theme.colors.label,
      fontFamily: theme.font.weights.medium,
    },
  });

  return { buttonRowHeight, styles };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const { buttonRowHeight, styles } = useStyles();

  const onContentSizeChange = (_: number, contentHeight: number) => {
    setScrollEnabled(contentHeight > screenHeight - buttonRowHeight);
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        onContentSizeChange={onContentSizeChange}
        style={styles.scrollView}
        scrollEnabled={scrollEnabled}
      >
        <CircleLogo />
        <AutoscaledText style={styles.title}>
          Organize
        </AutoscaledText>
        <AutoscaledText style={styles.subtitle}>
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
          onPress={() => navigation.navigate('NameOrg')}
          style={styles.button}
        />
        <PrimaryButton
          iconName="qr-code-2"
          label="Join Org"
          onPress={() => console.log('Join pressed!')}
          style={styles.button}
        />
      </View>
    </ScreenBackground>
  );
}
