import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextInputRow,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import {
  formatDate, getErrorMessage, useOrg, useUnionCard,
} from '../../model';

export const MAX_EMAIL_LENGTH = 100;
export const MAX_NAME_LENGTH = 100;
export const MAX_PHONE_LENGTH = 20;
export const MAX_EMPLOYER_NAME_LENGTH = 50;

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    agreement: {
      textAlign: 'center',
    },
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
    },
    container: {
      margin: spacing.m,
      rowGap: spacing.m,
    },
    section: {
      rowGap: spacing.s,
    },
    signedAt: {
      flex: 1,
      textAlign: 'right',
    },
    signRow: {
      alignItems: 'center',
      flexDirection: 'row',
      columnGap: spacing.m,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

function useUnionCardInfo({
  setLoading, setResult,
}: Pick<ReturnType<typeof useRequestProgress>, 'setLoading' | 'setResult'>) {
  const [email, setEmail] = useState<string>();
  const [employerName, setEmployerName] = useState<string>();
  const [name, setName] = useState<string>();
  const [orgName, setOrgName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [signedAt, setSignedAt] = useState<Date>();

  const agreement = `By tapping Sign, I authorize ${orgName ?? '<org_name>'} to represent me for the purpose of collective bargaining with ${employerName ?? '<employer_name>'}.`;

  const { createUnionCard, refreshUnionCard, unionCard } = useUnionCard();

  const { org, refreshOrg } = useOrg();
  const refresh = async () => {
    setLoading(true);
    setResult('none');

    try {
      await Promise.all([refreshOrg(), refreshUnionCard()]);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', {
        message: `${errorMessage}\nTap to try again`,
        onPress: refresh,
      });
    }

    setLoading(false);
  };

  useEffect(() => { refresh().catch(console.error); }, []);

  useEffect(() => {
    if (!org) { return; }

    setOrgName(org.name);

    setEmail(unionCard?.email);
    setEmployerName(org.employerName ?? unionCard?.employerName);
    setName(unionCard?.name);
    setPhone(unionCard?.phone);
    setSignedAt(unionCard?.signedAt);
  }, [org, unionCard]);

  const sign = async () => {
    setLoading(true);
    setResult('none');

    try {
      await createUnionCard({
        agreement, email, employerName, name, phone,
      });
    } catch (error) {
      setResult('error', { error });
    }

    setLoading(false);
  };

  return {
    agreement,
    email,
    employerName,
    name,
    orgName,
    phone,
    setEmail,
    setEmployerName,
    setName,
    setPhone,
    sign,
    signedAt,
  };
}

type InputName = 'email' | 'employerName' | 'name' | 'phone';

function useFocusedInput() {
  const [focusedInput, setFocusedInput] = useState<InputName | null>(null);

  const focused = (inputName: InputName) => (focusedInput === inputName);

  const onFocus = (inputName: InputName) => () => setFocusedInput(inputName);

  const onSubmitEditing = useCallback((inputName: InputName | null) => (() => {
    let nextInput: InputName | null = null;
    if (inputName === 'name') {
      nextInput = 'phone';
    } else if (inputName === 'phone') {
      nextInput = 'email';
    } else if (inputName === 'email') {
      nextInput = 'employerName';
    }
    setFocusedInput(nextInput);
  }), []);

  return { focused, onFocus, onSubmitEditing };
}

export default function UnionCardScreen() {
  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const {
    agreement, email, employerName, name, orgName, phone, setEmail,
    setEmployerName, setName, setPhone, sign, signedAt,
  } = useUnionCardInfo({ setLoading, setResult });
  const showForm = !!orgName;

  const { styles } = useStyles();
  const { focused, onFocus, onSubmitEditing } = useFocusedInput();

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      {showForm && (
        <>
          <View style={styles.section}>
            <HeaderText>Name</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect={false}
              autoFocus={false}
              editable={!loading}
              focused={focused('name')}
              maxLength={MAX_NAME_LENGTH}
              onChangeText={setName}
              onFocus={onFocus('name')}
              onSubmitEditing={onSubmitEditing('name')}
              placeholder="Abe Lincoln"
              submitBehavior="submit"
              value={name}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Phone</HeaderText>
            <TextInputRow
              autoComplete="tel"
              autoFocus={false}
              editable={!loading}
              focused={focused('phone')}
              keyboardType="phone-pad"
              maxLength={MAX_PHONE_LENGTH}
              onChangeText={setPhone}
              onFocus={onFocus('phone')}
              onSubmitEditing={onSubmitEditing('phone')}
              placeholder="5551234567"
              submitBehavior="submit"
              value={phone}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Email</HeaderText>
            <TextInputRow
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              autoFocus={false}
              editable={!loading}
              focused={focused('email')}
              keyboardType="email-address"
              maxLength={MAX_EMAIL_LENGTH}
              onChangeText={setEmail}
              onFocus={onFocus('email')}
              onSubmitEditing={onSubmitEditing('email')}
              placeholder="abe.lincoln@whitehouse.gov"
              submitBehavior="submit"
              value={email}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Employer name</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={false}
              editable={!loading}
              enterKeyHint="done"
              focused={focused('employerName')}
              maxLength={MAX_EMPLOYER_NAME_LENGTH}
              onChangeText={setEmployerName}
              onFocus={onFocus('employerName')}
              onSubmitEditing={onSubmitEditing('employerName')}
              placeholder="Acme, Inc."
              value={employerName}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Agreement</HeaderText>
            <Text style={[styles.text, styles.agreement]}>{agreement}</Text>
            <Text style={[styles.text, styles.agreement]}>
              Your union officers can view signed cards.
            </Text>
          </View>
        </>
      )}
      <RequestProgress />
      {showForm && (
        <View style={styles.signRow}>
          <Text style={[styles.text, styles.signedAt]}>
            {signedAt && `Signed on ${formatDate(signedAt, 'dateOnlyShort')}`}
          </Text>
          <PrimaryButton
            iconName="draw"
            label="Sign"
            onPress={sign}
            style={styles.button}
          />
        </View>
      )}
    </KeyboardAvoidingScreenBackground>
  );
}
