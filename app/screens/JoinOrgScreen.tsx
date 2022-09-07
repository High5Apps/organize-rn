import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, MembershipReview, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton, useRequestProgress,
} from '../components';
import { GENERIC_ERROR_MESSAGE, QRCodeValue, useUserContext } from '../model';
import { UserType } from '../model/User';
import type { JoinOrgScreenProps } from '../navigation';
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

const primaryButtonLabel = 'Join';

export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useState<QRCodeValue | null>(null);

  const { styles } = useStyles();
  const { createCurrentUser, setCurrentUser } = useUserContext();
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

  const onJoinPressed = async () => {
    if (!qrValue) { return; }

    setLoading(true);
    setResult('none');

    const { jwt: sharerJwt, org } = qrValue;
    const { id: orgId, ...unpublishedOrg } = org;

    let currentUser: UserType | null = null;
    let succeeded = false;
    try {
      const userOrErrorMessage = await createCurrentUser({
        orgId, unpublishedOrg, sharerJwt,
      });

      if (typeof userOrErrorMessage === 'string') {
        setResult('error', userOrErrorMessage);
        return;
      }

      currentUser = userOrErrorMessage;

      succeeded = true;
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
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
          prompt="To join an Org, scan the secret code of a current member."
          promptHidden={!!qrValue}
          qrValue={qrValue}
          ReviewComponent={!!qrValue && (
            <MembershipReview
              qrValue={qrValue}
              style={StyleSheet.absoluteFill}
            />
          )}
          setQRValue={setQRValue}
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
