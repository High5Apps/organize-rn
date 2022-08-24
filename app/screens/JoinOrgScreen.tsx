import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton,
} from '../components';
import { QRCodeValue, useUserContext } from '../model';
import { UserType } from '../model/User';
import type { JoinOrgScreenProps } from '../navigation';
import { createConnection } from '../networking';
import useTheme from '../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    backButton: {
      paddingEnd: spacing.l,
    },
    button: {
      flex: 0,
      marginHorizontal: spacing.s,
    },
    errorMessage: {
      color: colors.error,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      textAlign: 'center',
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

const GENERIC_ERROR_MESSAGE = 'Something unexpected happened. Please try again later.';

export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useState<QRCodeValue>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { styles } = useStyles();
  const { createCurrentUser, setCurrentUser } = useUserContext();

  const primaryButtonLabel = 'Join';

  const onJoinPressed = async () => {
    if (!qrValue) { return; }

    setLoading(true);
    setErrorMessage(null);

    const { id: orgId, ...unpublishedOrg } = qrValue.org;

    let currentUser: UserType | null = null;
    try {
      const userOrErrorMessage = await createCurrentUser({
        orgId, unpublishedOrg,
      });

      if (typeof userOrErrorMessage === 'string') {
        setErrorMessage(userOrErrorMessage);
        setLoading(false);
        return;
      }

      currentUser = userOrErrorMessage;

      const jwt = await currentUser.createAuthToken();
      const sharerJwt = qrValue.jwt;
      const maybeErrorMessage = await createConnection({ jwt, sharerJwt });

      if (maybeErrorMessage) {
        setErrorMessage(maybeErrorMessage);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(GENERIC_ERROR_MESSAGE);
    }

    setLoading(false);
    setCurrentUser(currentUser);
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
        {loading && <ActivityIndicator />}
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
