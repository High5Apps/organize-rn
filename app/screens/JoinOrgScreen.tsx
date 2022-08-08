import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton,
} from '../components';
import { QRCodeValue, useUserContext } from '../model';
import type { JoinOrgScreenProps } from '../navigation';
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

    createCurrentUser({ orgId, unpublishedOrg })
      .then(async (userOrErrorMessage) => {
        setLoading(false);
        if (typeof userOrErrorMessage === 'string') {
          setErrorMessage(userOrErrorMessage);
          return;
        }
        setCurrentUser(userOrErrorMessage);
      }).catch(console.error);
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
