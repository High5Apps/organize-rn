import React, { useCallback, useState } from 'react';
import {
  Keyboard, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextButton,
  TextInputRow, useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { Email, useCurrentUser } from '../../model';

const CONTACT_US_BODY = "I'd like to create a new Org on the Organize app. Please send me a verification code!";
const CONTACT_US_SUBJECT = 'Organize Verification';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-end',
      flex: 0,
      height: sizes.buttonHeight,
      marginHorizontal: spacing.m,
      paddingHorizontal: spacing.m,
    },
    containerStyle: {
      rowGap: spacing.m,
    },
    headerText: {
      marginHorizontal: spacing.m,
      marginBottom: spacing.s,
    },
    message: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      textAlign: 'center',
    },
    textButton: {
      fontFamily: font.weights.semiBold,
    },
    textContainer: {
      alignItems: 'baseline',
      columnGap: spacing.xs,
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: spacing.m,
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.largeTitle,
      marginHorizontal: spacing.m,
      marginTop: spacing.m,
    },
  });

  return { styles };
};

export default function VerificationScreen() {
  const [code, setCode] = useState('');

  const {
    RequestProgress, setResult, setLoading,
  } = useRequestProgress({ removeWhenInactive: true });

  const { currentUser } = useCurrentUser();
  const onVerify = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected currentUser'); }

    setLoading(true);
    setResult('none');

    try {
      await currentUser.verify(code);
      setLoading(false);
      // Navigation to the Org tabs happens as a result of the code in
      // Navigation.tsx that checks whether currentUser.org.verified is truthy
    } catch (error) {
      setResult('error', { error });
    }
  }, [code, currentUser]);

  const { styles } = useStyles();

  return (
    <KeyboardAvoidingScreenBackground topNavigationBarHidden>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.containerStyle}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Account Verification</Text>
        <View>
          <HeaderText style={styles.headerText}>Code</HeaderText>
          <TextInputRow
            autoFocus={false}
            blurOnSubmit={false}
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setCode}
            onSubmitEditing={Keyboard.dismiss}
            placeholder="123456"
            returnKeyType="none"
            value={code}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message}>Don&apos;t have a code yet?</Text>
          <TextButton
            onPress={Email({
              body: `${CONTACT_US_BODY}\n\nReference ID: ${currentUser!.org!.id}`,
              subject: CONTACT_US_SUBJECT,
            }).openComposer}
            style={styles.textButton}
          >
            Contact Us
          </TextButton>
        </View>
        <PrimaryButton
          iconName="verified"
          label="Verify"
          onPress={onVerify}
          style={styles.button}
        />
        <RequestProgress />
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
