import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  LockingScrollView, PrimaryButton, ScreenBackground, WarningView,
} from '../../components';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, sizes, spacing } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    container: {
      backgroundColor: colors.fill,
      padding: spacing.m,
      rowGap: spacing.m,
    },
    iconRotated90Degrees: {
      transform: [{ rotate: '90deg' }],
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContainer: {
      paddingBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function UnionCardsScreen() {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingScrollView
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.scrollView}
      >
        <View style={styles.container}>
          <WarningView
            warning="Warning! Union cards are sensitive info"
            warningBullets={[
              {
                iconName: 'account-balance',
                message: "Don't share them with anyone but your regional NLRB office.",
              },
              {
                iconName: 'battery-2-bar',
                iconStyle: styles.iconRotated90Degrees,
                message: 'At least 30% of potential members must sign union cards before you can request a certification election.',
              },
              {
                iconName: 'battery-5-bar',
                iconStyle: styles.iconRotated90Degrees,
                message: 'But waiting until you reach 70% makes you way more likely to win.',
              },
            ]}
          />
        </View>
      </LockingScrollView>
      <PrimaryButton
        iconName="download"
        label="Download"
        onPress={() => console.log('download')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
