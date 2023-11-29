import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, ConnectionReview, LockingScrollView, NewConnectionControl,
  PrimaryButton, ResultType, ScreenBackground, useRequestProgress,
} from '../../components';
import {
  GENERIC_ERROR_MESSAGE, QRCodeValue, useUserContext,
} from '../../model';
import { ConnectionPreview, createConnection } from '../../networking';
import { Status } from '../../networking/API';
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
  const { currentUser } = useUserContext();
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
    if (!qrValue || !currentUser) {
      console.warn('Expected qrValue and currentUser to be set');
      return;
    }

    setLoading(true);
    setResult('none');

    let message: string | undefined;
    let connectionResult: ResultType;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const sharerJwt = qrValue.jwt;
      const {
        errorMessage: maybeErrorMessage, status,
      } = await createConnection({ jwt, sharerJwt });

      if (maybeErrorMessage) {
        message = maybeErrorMessage;
        connectionResult = 'error';
      } else {
        message = (status === Status.Success)
          ? 'Reconnected successfully' : 'Connected successfully';
        connectionResult = 'success';
      }
    } catch (error) {
      console.error(error);
      connectionResult = 'error';
      message = GENERIC_ERROR_MESSAGE;
    }

    if (connectionResult === 'error') {
      setErrorMessage(message);
    } else {
      setResult(connectionResult, { message });
    }

    setLoading(false);
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
