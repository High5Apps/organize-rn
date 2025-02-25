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
      padding: spacing.m,
      rowGap: spacing.m,
    },
    section: {
      rowGap: spacing.s,
    },
    signOrUndoProgress: {
      alignItems: 'flex-end',
      flex: 1,
    },
    signOrUndoProgressMessage: {
      paddingHorizontal: 0,
      textAlign: 'right',
    },
    signRow: {
      alignItems: 'center',
      flexDirection: 'row-reverse',
      columnGap: spacing.m,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textSecondary: {
      color: colors.labelSecondary,
    },
  });

  return { styles };
};

type Props = {
  setRefreshing: ReturnType<typeof useRequestProgress>['setLoading'];
  setRefreshResult: ReturnType<typeof useRequestProgress>['setResult'];
  setSigningOrUndoing: ReturnType<typeof useRequestProgress>['setLoading'];
  setSignOrUndoResult: ReturnType<typeof useRequestProgress>['setResult'];
};

function useUnionCardInfo({
  setRefreshing, setRefreshResult, setSigningOrUndoing, setSignOrUndoResult,
}: Props) {
  const [email, setEmail] = useState<string>();
  const [employerName, setEmployerName] = useState<string>();
  const [name, setName] = useState<string>();
  const [orgName, setOrgName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [signedAt, setSignedAt] = useState<Date>();

  const {
    createUnionCard, refreshUnionCard, removeUnionCard, unionCard,
  } = useUnionCard();

  const agreement = unionCard?.agreement ?? `By tapping Sign, I authorize ${orgName || '__________'} to represent me for the purpose of collective bargaining with ${employerName || '__________'}`;

  const { org, refreshOrg } = useOrg();
  const refresh = async () => {
    setRefreshing(true);
    setRefreshResult('none');

    try {
      await Promise.all([refreshOrg(), refreshUnionCard()]);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setRefreshResult('error', {
        message: `${errorMessage}\nTap to try again`,
        onPress: refresh,
      });
    }

    setRefreshing(false);
  };

  useEffect(() => { refresh().catch(console.error); }, []);

  useEffect(() => {
    if (!org) { return; }

    setOrgName(org.name);

    if (!unionCard) {
      setSignedAt(undefined);
      return;
    }

    setEmail(unionCard.email);
    setEmployerName(org.employerName ?? unionCard.employerName);
    setName(unionCard.name);
    setPhone(unionCard.phone);
    setSignedAt(unionCard.signedAt);
    setSignOrUndoResult('success', {
      message: `Signed on ${formatDate(unionCard.signedAt, 'dateOnlyShort')}`,
    });
  }, [org, unionCard]);

  const sign = async () => {
    setSigningOrUndoing(true);
    setSignOrUndoResult('none');

    try {
      await createUnionCard({
        agreement, email, employerName, name, phone,
      });
    } catch (error) {
      setSignOrUndoResult('error', { error });
    }

    setSigningOrUndoing(false);
  };

  const undo = async () => {
    setSigningOrUndoing(true);
    setSignOrUndoResult('none');

    try {
      await removeUnionCard();
    } catch (error) {
      setSignOrUndoResult('error', { error });
    }

    setSigningOrUndoing(false);
  };

  return {
    agreement,
    email,
    employerName,
    name,
    phone,
    setEmail,
    setEmployerName,
    setName,
    setPhone,
    sign,
    signedAt,
    undo,
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
    loading: refreshing,
    RequestProgress: RefreshProgress,
    setLoading: setRefreshing,
    setResult: setRefreshResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const {
    loading: signingOrUndoing,
    RequestProgress: SignOrUndoProgress,
    setLoading: setSigningOrUndoing,
    setResult: setSignOrUndoResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const {
    agreement, email, employerName, name, phone, setEmail, setEmployerName,
    setName, setPhone, sign, signedAt, undo,
  } = useUnionCardInfo({
    setRefreshing, setRefreshResult, setSigningOrUndoing, setSignOrUndoResult,
  });
  const inputsEditable = !signingOrUndoing && !signedAt;

  const { styles } = useStyles();
  const { focused, onFocus, onSubmitEditing } = useFocusedInput();

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      {refreshing ? <RefreshProgress /> : (
        <>
          <View style={styles.section}>
            <HeaderText>Name</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect={false}
              autoFocus={false}
              editable={inputsEditable}
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
              editable={inputsEditable}
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
              editable={inputsEditable}
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
              editable={inputsEditable}
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
            <Text style={[styles.text, styles.agreement, styles.textSecondary]}>
              Your union officers can view signed cards
            </Text>
          </View>
          <View style={styles.signRow}>
            {signedAt ? (
              <PrimaryButton
                iconName="restart-alt"
                label="Undo"
                onPress={undo}
                style={styles.button}
              />
            ) : (
              <PrimaryButton
                iconName="draw"
                label="Sign"
                onPress={sign}
                style={styles.button}
              />
            )}
            <SignOrUndoProgress
              messageStyle={styles.signOrUndoProgressMessage}
              style={styles.signOrUndoProgress}
            />
          </View>
        </>
      )}
    </KeyboardAvoidingScreenBackground>
  );
}
