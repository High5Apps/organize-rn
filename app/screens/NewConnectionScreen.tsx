import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, useRequestProgress,
} from '../components';
import { GENERIC_ERROR_MESSAGE, QRCodeValue, useUserContext } from '../model';
import { createConnection } from '../networking';
import { Status } from '../networking/apis/API';
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
      const jwt = await currentUser.createAuthToken();
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
          expectedOrgId={currentUser?.orgId}
          prompt="Connect with other members of your Org by scanning their secret code."
          promptHidden={!!qrValue}
          qrValue={qrValue}
          setQRValue={setQRValue}
        />
      </LockingScrollView>
      <>
        <RequestProgress />
        <ButtonRow elevated={buttonRowElevated} style={styles.buttonRow}>
          {qrValue && (result !== 'success') && (
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
