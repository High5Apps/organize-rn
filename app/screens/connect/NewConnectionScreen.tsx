import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, ConnectionReview, LockingAwareScrollView, NewConnectionControl,
  PrimaryButton, ScreenBackground, useRequestProgress,
} from '../../components';
import { ConnectionPreview, useConnection, useQRValue } from '../../model';
import useTheme from '../../Theme';
import type { NewConnectionScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
      marginHorizontal: spacing.s,
    },
    buttonRow: {
      flexDirection: 'row-reverse',
    },
    scrollView: {
      marginTop: spacing.m,
    },
  });

  return { styles };
};

export default function NewConnectionScreen({
  route,
}: NewConnectionScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useQRValue(route.params);
  const [
    connectionPreview, setConnectionPreview,
  ] = useState<ConnectionPreview | null>(null);

  const { styles } = useStyles();
  const { t } = useTranslation();
  const { createConnection } = useConnection({ sharerJwt: qrValue?.jwt });
  const {
    RequestProgress, result, setLoading, setResult,
  } = useRequestProgress();

  useEffect(() => {
    if (qrValue) {
      setResult('none');
    }
  }, [qrValue]);

  const setErrorMessage = useCallback((message: string) => {
    setResult('error', { message });
    setQRValue(null);
  }, []);

  const onConnectPressed = async () => {
    setLoading(true);
    setResult('none');

    try {
      const { isReconnection } = await createConnection();
      const message = t(isReconnection
        ? 'result.success.reconnection' : 'result.success.connection');
      setResult('success', { message });
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <ScreenBackground>
      <LockingAwareScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          prompt={t('hint.scanToConnect')}
          promptHidden={!!qrValue}
          qrValue={qrValue}
          ReviewComponent={!!qrValue && (
            <ConnectionReview
              onConnectionPreview={setConnectionPreview}
              onConnectionPreviewError={setErrorMessage}
              qrValue={qrValue}
              style={StyleSheet.absoluteFill}
            />
          )}
          setQRValue={setQRValue}
        />
      </LockingAwareScrollView>
      <>
        <RequestProgress />
        <ButtonRow elevated={buttonRowElevated} style={styles.buttonRow}>
          {!!qrValue && connectionPreview && (result !== 'success') && (
            <PrimaryButton
              iconName="person-add"
              label={t('action.connect')}
              onPress={onConnectPressed}
              style={[styles.button]}
            />
          )}
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
