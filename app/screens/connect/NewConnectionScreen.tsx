import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, ConnectionReview, LockingScrollView, NewConnectionControl,
  PrimaryButton, ScreenBackground, useRequestProgress,
} from '../../components';
import { ConnectionPreview, QRCodeValue, useConnection } from '../../model';
import useTheme from '../../Theme';

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

export default function NewConnectionScreen() {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useState<QRCodeValue | null>(null);
  const [
    connectionPreview, setConnectionPreview,
  ] = useState<ConnectionPreview | null>(null);

  const { styles } = useStyles();
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
      const message = isReconnection
        ? 'Reconnected successfully' : 'Connected successfully';
      setResult('success', { message });
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <ScreenBackground>
      <LockingScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          prompt="Connect with other members of your Org by scanning their secret code."
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
      </LockingScrollView>
      <>
        <RequestProgress />
        <ButtonRow elevated={buttonRowElevated} style={styles.buttonRow}>
          {!!qrValue && connectionPreview && (result !== 'success') && (
            <PrimaryButton
              iconName="person-add"
              label="Connect"
              onPress={onConnectPressed}
              style={[styles.button]}
            />
          )}
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
