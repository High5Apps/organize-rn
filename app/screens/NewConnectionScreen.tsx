import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground, SecondaryButton,
} from '../components';
import type { NewConnectionScreenProps } from '../navigation';
import useTheme from '../Theme';
import { placeholderOrgId } from '../model/FakeQRCodeValue';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      marginHorizontal: spacing.s,
    },
    primaryButton: {
      paddingHorizontal: spacing.m,
    },
    scrollView: {
      marginTop: spacing.m,
    },
  });

  return { styles };
};

export default function NewConnectionScreen({
  navigation,
}: NewConnectionScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          // TODO: Use real orgId
          expectedOrgId={placeholderOrgId}
          onQRCodeValueScanned={() => setScanned(true)}
          prompt="To join an Org, scan the secret code of a current member."
          promptHidden={scanned}
        />
      </LockingScrollView>
      <ButtonRow elevated={buttonRowElevated}>
        <SecondaryButton
          iconName="cancel"
          label="Cancel"
          onPress={navigation.goBack}
          style={styles.button}
        />
        {scanned && (
          <PrimaryButton
            iconName="person-add"
            label="Connect"
            onPress={navigation.goBack}
            style={[styles.button, styles.primaryButton]}
          />
        )}
      </ButtonRow>
    </ScreenBackground>
  );
}
