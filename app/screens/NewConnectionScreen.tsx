import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, ConnectionReview, LockingScrollView, NewConnectionControl,
  PrimaryButton, ScreenBackground, useRequestProgress,
} from '../components';
import { GENERIC_ERROR_MESSAGE, QRCodeValue, useUserContext } from '../model';
import { ConnectionPreview, createConnection } from '../networking';
import { Status } from '../networking/API';
import useTheme from '../Theme';

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
    if (result === 'error') {
      setQRValue(null);
    }
  }, [result]);

  useEffect(() => {
    if (qrValue) {
      setResult('none');
    }
  }, [qrValue]);

  const onConnectPressed = async () => {
    if (!qrValue || !currentUser) {
      console.warn('Expected qrValue and currentUser to be set');
      return;
    }

    setLoading(true);
    setResult('none');

    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const sharerJwt = qrValue.jwt;
      const {
        errorMessage, status,
      } = await createConnection({ jwt, sharerJwt });

      if (errorMessage) {
        setResult('error', errorMessage);
      } else if (status === Status.Success) {
        setResult('success', 'Reconnected successfully');
      } else {
        setResult('success', 'Connected successfully');
      }
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
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
          {connectionPreview && (result !== 'success') && (
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
