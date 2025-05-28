import React, { useCallback, useState } from 'react';
import {
  Keyboard, Platform, StyleSheet, Text, View,
} from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextButton,
  TextInputRow, useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { Email, useCurrentUser } from '../../model';
import { useTranslation } from '../../i18n';

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
    container: {
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
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('action.verifyAccount')}</Text>
      <View>
        <HeaderText style={styles.headerText}>
          {t('object.verificationCode')}
        </HeaderText>
        <TextInputRow
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setCode}
          onSubmitEditing={Keyboard.dismiss}
          placeholder={t('placeholder.verificationCode')}
          returnKeyType={Platform.OS === 'android' ? 'none' : 'default'}
          value={code}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.message}>{t('question.verificationCode')}</Text>
        <TextButton
          onPress={Email({
            body: t('email.body.verificationCodeRequest', {
              referenceId: currentUser!.org!.id,
            }),
            subject: t('email.subject.verificationCodeRequest'),
          }).openComposer}
          style={styles.textButton}
        >
          {t('action.contactUs')}
        </TextButton>
      </View>
      <PrimaryButton
        iconName="verified"
        label={t('action.verify')}
        onPress={onVerify}
        style={styles.button}
      />
      <RequestProgress />
    </KeyboardAvoidingScreenBackground>
  );
}
