import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextInputRow,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { getErrorMessage, useOrg } from '../../model';

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
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      textAlign: 'center',
    },
    button: {
      alignSelf: 'flex-end',
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
  const agreement = `By tapping Sign, I authorize ${orgName ?? '<org_name>'} to represent me for the purpose of collective bargaining with ${employerName ?? '<employer_name>'}.`;

  const { org, refreshOrg } = useOrg();
  const refresh = async () => {
    setLoading(true);
    setResult('none');

    try {
      await refreshOrg();
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

    setEmployerName(org.employerName);
    setOrgName(org.name);
  }, [org]);

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
  };
}

type InputName = 'email' | 'employerName' | 'name' | 'phone';

export default function UnionCardScreen() {
  const [focusedInput, setFocusedInput] = useState<InputName | null>(null);

  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const {
    agreement, email, employerName, name, orgName, phone, setEmail,
    setEmployerName, setName, setPhone,
  } = useUnionCardInfo({ setLoading, setResult });
  const showForm = !!orgName;

  const { styles } = useStyles();

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
              focused={focusedInput === 'name'}
              maxLength={MAX_NAME_LENGTH}
              onChangeText={setName}
              onFocus={() => setFocusedInput('name')}
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
              focused={focusedInput === 'phone'}
              keyboardType="phone-pad"
              maxLength={MAX_PHONE_LENGTH}
              onChangeText={setPhone}
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
              focused={focusedInput === 'email'}
              keyboardType="email-address"
              maxLength={MAX_EMAIL_LENGTH}
              onChangeText={setEmail}
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
              focused={focusedInput === 'employerName'}
              maxLength={MAX_EMPLOYER_NAME_LENGTH}
              onChangeText={setEmployerName}
              onSubmitEditing={onSubmitEditing('employerName')}
              placeholder="Acme, Inc."
              value={employerName}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Agreement</HeaderText>
            <Text style={styles.agreement}>{agreement}</Text>
          </View>
        </>
      )}
      <RequestProgress />
      {showForm && (
        <PrimaryButton
          iconName="draw"
          label="Sign"
          onPress={() => console.log('sign')}
          style={styles.button}
        />
      )}
    </KeyboardAvoidingScreenBackground>
  );
}
