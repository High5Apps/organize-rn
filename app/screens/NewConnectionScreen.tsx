import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ButtonRow, LockingScrollView, NewConnectionControl, PrimaryButton,
  ScreenBackground,
} from '../components';
import { useUserContext } from '../model';
import type { NewConnectionScreenProps } from '../navigation';
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

export default function NewConnectionScreen({
  navigation,
}: NewConnectionScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const [scanned, setScanned] = useState(false);

  const { styles } = useStyles();
  const { currentUser } = useUserContext();

  return (
    <ScreenBackground>
      <LockingScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <NewConnectionControl
          // TODO: Use real orgId
          expectedOrgId={currentUser?.orgId}
          onQRCodeValueScanned={() => setScanned(true)}
          prompt="To join an Org, scan the secret code of a current member."
          promptHidden={scanned}
        />
      </LockingScrollView>
      <ButtonRow elevated={buttonRowElevated} style={styles.buttonRow}>
        {scanned && (
          <PrimaryButton
            iconName="person-add"
            label="Connect"
            onPress={navigation.goBack}
            style={[styles.button]}
          />
        )}
      </ButtonRow>
    </ScreenBackground>
  );
}
