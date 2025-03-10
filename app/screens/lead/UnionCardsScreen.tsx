import React from 'react';
import { StyleSheet, View } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';
import {
  LockingScrollView, PrimaryButton, ScreenBackground, SecondaryButton,
  useRequestProgress, WarningView,
} from '../../components';
import useTheme from '../../Theme';
import { useUnionCards } from '../../model';

const useStyles = () => {
  const { colors, sizes, spacing } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    buttonPrimary: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      columnGap: spacing.m,
    },
    buttonSecondary: {
      paddingHorizontal: spacing.m,
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
  const { filePath, recreateFile } = useUnionCards();
  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const disableSecondaryButtons = !filePath || loading;

  const { styles } = useStyles();

  const onDownloadPressed = async () => {
    setLoading(true);
    setResult('none');

    try {
      const { verificationFailureCount } = await recreateFile();
      if (verificationFailureCount) {
        const message = `Failed to verify ${verificationFailureCount} union card signature${(verificationFailureCount > 1) ? 's' : ''}. To fix this, update your app and then try again.`;
        setResult('warning', { message });
      }
      setLoading(false);
    } catch (error) {
      setResult('error', { error });
    }
  };

  const onOpenPressed = async () => {
    if (!filePath) { return; }

    setResult('none');

    try {
      await FileViewer.open(filePath, {
        showAppsSuggestions: true,
        showOpenWithDialog: true,
      });
    } catch (error) {
      setResult('error', { error });
    }
  };

  const onSharePressed = async () => {
    if (!filePath) { return; }

    setResult('none');

    try {
      await Share.open({
        failOnCancel: false,
        showAppsToView: true,
        type: 'text/csv',
        url: `file://${filePath}`,
      });
    } catch (error) {
      setResult('error', { error });
    }
  };

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
          <View style={styles.buttonRow}>
            <SecondaryButton
              disabled={disableSecondaryButtons}
              iconName="description"
              label="Open"
              onPress={onOpenPressed}
              style={styles.buttonSecondary}
            />
            <SecondaryButton
              disabled={disableSecondaryButtons}
              iconName="share"
              label="Share"
              onPress={onSharePressed}
              style={styles.buttonSecondary}
            />
          </View>
          <RequestProgress />
        </View>
      </LockingScrollView>
      <PrimaryButton
        iconName="download"
        label="Download"
        onPress={onDownloadPressed}
        style={styles.buttonPrimary}
      />
    </ScreenBackground>
  );
}
