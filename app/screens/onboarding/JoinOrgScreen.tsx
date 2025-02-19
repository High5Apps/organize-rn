import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Agreement, ButtonRow, LockingAwareScrollView, MembershipReview,
  NewConnectionControl, PrimaryButton, ScreenBackground, SecondaryButton,
  useRequestProgress,
} from '../../components';
import {
  ConnectionPreview, createCurrentUser, getErrorMessage, useCurrentUser,
  useQRValue,
} from '../../model';
import type { JoinOrgScreenProps } from '../../navigation';
import useTheme from '../../Theme';

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

export default function JoinOrgScreen({ navigation, route }: JoinOrgScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useQRValue(route.params);
  const [
    connectionPreview, setConnectionPreview,
  ] = useState<ConnectionPreview | null>(null);

  const { styles } = useStyles();
  const { setCurrentUser } = useCurrentUser();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  useEffect(() => {
    if (qrValue) {
      setResult('none');
    }
  }, [qrValue]);

  const setErrorMessage = useCallback((message: string) => {
    setResult('error', { message });
    setQRValue(null);
  }, []);

  const onJoinPressed = async () => {
    if (!qrValue || !connectionPreview) { return; }

    setLoading(true);
    setResult('none');

    const { groupKey, jwt: sharerJwt } = qrValue;
    const { org } = connectionPreview;
    const { id: orgId, ...unpublishedOrg } = org;

    let errorMessage: string | undefined;
    try {
      const userOrErrorMessage = await createCurrentUser({
        groupKey, orgId, unpublishedOrg, sharerJwt,
      });

      if (typeof userOrErrorMessage === 'string') {
        errorMessage = userOrErrorMessage;
      } else {
        setCurrentUser(userOrErrorMessage);
        return;
      }
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    setErrorMessage(errorMessage);
  };

  return (
    <ScreenBackground>
      <LockingAwareScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          prompt="To join an Org, scan the secret code of a current member."
          promptHidden={!!qrValue}
          qrValue={qrValue}
          ReviewComponent={!!qrValue && (
            <MembershipReview
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
        {!!qrValue && connectionPreview && (
          <Agreement buttonLabel={primaryButtonLabel} />
        )}
        <ButtonRow elevated={buttonRowElevated}>
          <SecondaryButton
            iconName="navigate-before"
            label="Back"
            onPress={navigation.goBack}
            style={[styles.button, styles.backButton]}
          />
          {!!qrValue && connectionPreview && (
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
