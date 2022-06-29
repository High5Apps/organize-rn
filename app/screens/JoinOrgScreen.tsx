import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton,
} from '../components';
import {
  Keys, QRCodeValue, User, useUserContext,
} from '../model';
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

export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [qrValue, setQRValue] = useState<QRCodeValue>();
  const { styles } = useStyles();
  const { setCurrentUser } = useUserContext();

  async function createCurrentUser() {
    if (!qrValue) { return; }
    const { publicKeyId } = await Keys().rsa.create(2048);

    // TODO: UsersController#create
    const { org } = qrValue;
    const newUser = User({ org, orgId: org.id, publicKeyId });
    setCurrentUser(newUser);
  }

  const primaryButtonLabel = 'Join';

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
              onPress={() => createCurrentUser().catch(console.error)}
              style={[styles.button, styles.joinButton]}
            />
          )}
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
