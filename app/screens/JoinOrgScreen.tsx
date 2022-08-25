import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton, useRequestProgress,
} from '../components';
import { GENERIC_ERROR_MESSAGE, QRCodeValue, useUserContext } from '../model';
import { UserType } from '../model/User';
import type { JoinOrgScreenProps } from '../navigation';
import { createConnection } from '../networking';
import useTheme from '../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    backButton: {
      paddingEnd: spacing.l,
    },
    button: {
      flex: 0,
      marginHorizontal: spacing.s,
    },
    joinButton: {
      paddingHorizontal: spacing.m,
    },
    scrollView: {
      flexGrow: 1,
      marginTop: spacing.m,
    },
  });

  return { styles };
};

export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useState<QRCodeValue>();

  const { styles } = useStyles();
  const { createCurrentUser, setCurrentUser } = useUserContext();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const primaryButtonLabel = 'Join';

  const onJoinPressed = async () => {
    if (!qrValue) { return; }

    setLoading(true);
    setResult('none');

    const { id: orgId, ...unpublishedOrg } = qrValue.org;

    let currentUser: UserType | null = null;
    let succeeded = false;
    try {
      const userOrErrorMessage = await createCurrentUser({
        orgId, unpublishedOrg,
      });

      if (typeof userOrErrorMessage === 'string') {
        setResult('error', userOrErrorMessage);
        setLoading(false);
        return;
      }

      currentUser = userOrErrorMessage;

      const jwt = await currentUser.createAuthToken();
      const sharerJwt = qrValue.jwt;
      const maybeErrorMessage = await createConnection({ jwt, sharerJwt });

      if (maybeErrorMessage) {
        setResult('error', maybeErrorMessage);
        setLoading(false);
        return;
      }

      succeeded = true;
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
      setLoading(false);
    }

    if (succeeded) {
      setCurrentUser(currentUser);
    }
  };

  return (
    <ScreenBackground>
      <LockingScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          onQRCodeValueScanned={setQRValue}
          prompt="To join an Org, scan the secret code of a current member."
          promptHidden={!!qrValue}
        />
      </LockingScrollView>
      <>
        <RequestProgress />
        {qrValue && <Agreement buttonLabel={primaryButtonLabel} />}
        <ButtonRow elevated={buttonRowElevated}>
          <SecondaryButton
            iconName="navigate-before"
            label="Back"
            onPress={navigation.goBack}
            style={[styles.button, styles.backButton]}
          />
          {qrValue && (
            <PrimaryButton
              iconName="person-add"
              label={primaryButtonLabel}
              onPress={onJoinPressed}
              style={[styles.button, styles.joinButton]}
            />
          )}
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
