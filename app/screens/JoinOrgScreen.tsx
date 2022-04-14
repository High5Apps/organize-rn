import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import {
  Agreement, ButtonRow, CameraControl, PrimaryButton, ScreenBackground,
  SecondaryButton,
} from '../components';
import { JoinOrgScreenProps } from '../navigation';
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
    joinButton: {
      paddingHorizontal: spacing.m,
    },
    prompt: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      marginTop: spacing.m,
      textAlign: 'center',
    },
    scrollView: {
      flexGrow: 1,
      marginTop: spacing.m,
    },
    topContainer: {
      padding: spacing.m,
    },
  });

  return { styles };
};

export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const [scanned, setScanned] = useState(false);
  const { styles } = useStyles();

  const primaryButtonLabel = 'Join';

  return (
    <ScreenBackground>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View style={styles.topContainer}>
          <CameraControl onQRCodeValueScanned={() => setScanned(true)} />
          {!scanned && (
            <Text style={styles.prompt}>
              To join an Org, scan the secret code of a current member.
            </Text>
          )}
        </View>
      </ScrollView>
      <>
        {scanned && <Agreement buttonLabel={primaryButtonLabel} />}
        <ButtonRow>
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
