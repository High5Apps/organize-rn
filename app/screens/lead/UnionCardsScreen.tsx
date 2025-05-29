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
import { useTranslation } from '../../i18n';

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
  const { t } = useTranslation();

  const onDownloadPressed = async () => {
    setLoading(true);
    setResult('none');

    try {
      const { verificationFailureCount } = await recreateFile();
      if (verificationFailureCount) {
        const message = t('result.error.verifyUnionCard', {
          count: verificationFailureCount,
        });
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
            warning={t('explanation.warning.viewUnionCards.message')}
            warningBullets={[
              {
                iconName: 'account-balance',
                message: t('explanation.warning.viewUnionCards.doNotShare'),
              },
              {
                iconName: 'battery-2-bar',
                iconStyle: styles.iconRotated90Degrees,
                message: t(
                  'explanation.warning.viewUnionCards.minimumThreshold',
                ),
              },
              {
                iconName: 'battery-5-bar',
                iconStyle: styles.iconRotated90Degrees,
                message: t(
                  'explanation.warning.viewUnionCards.recommendedThreshold',
                ),
              },
            ]}
          />
          <View style={styles.buttonRow}>
            <SecondaryButton
              disabled={disableSecondaryButtons}
              iconName="description"
              label={t('action.open')}
              onPress={onOpenPressed}
              style={styles.buttonSecondary}
            />
            <SecondaryButton
              disabled={disableSecondaryButtons}
              iconName="share"
              label={t('action.share')}
              onPress={onSharePressed}
              style={styles.buttonSecondary}
            />
          </View>
          <RequestProgress />
        </View>
      </LockingScrollView>
      <PrimaryButton
        iconName="download"
        label={t('action.download')}
        onPress={onDownloadPressed}
        style={styles.buttonPrimary}
      />
    </ScreenBackground>
  );
}
