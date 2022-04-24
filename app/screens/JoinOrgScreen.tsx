import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Agreement, ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton,
} from '../components';
import { JoinOrgScreenProps } from '../navigation';
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
  const [scanned, setScanned] = useState(false);
  const { styles } = useStyles();

  const primaryButtonLabel = 'Join';

  return (
    <ScreenBackground>
      <LockingScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          onQRCodeValueScanned={() => setScanned(true)}
          prompt="To join an Org, scan the secret code of a current member."
          promptHidden={scanned}
        />
      </LockingScrollView>
      <>
        {scanned && <Agreement buttonLabel={primaryButtonLabel} />}
        <ButtonRow elevated={buttonRowElevated}>
          <SecondaryButton
            iconName="navigate-before"
            label="Back"
            onPress={navigation.goBack}
            style={[styles.button, styles.backButton]}
          />
          {scanned && (
            <PrimaryButton
              iconName="person-add"
              label={primaryButtonLabel}
              onPress={() => navigation.replace('OrgTabs', {
                screen: 'ConnectStack',
              })}
              style={[styles.button, styles.joinButton]}
            />
          )}
        </ButtonRow>
      </>
    </ScreenBackground>
  );
}
