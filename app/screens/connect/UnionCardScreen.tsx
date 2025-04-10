import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, Text, TextInputProps, View,
} from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextInputRow,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import {
  formatDate, getErrorMessage, useMyPermissions, useOrg, useUnionCard,
} from '../../model';

export const MAX_EMAIL_LENGTH = 100;
export const MAX_HOME_ADDRESS_LINE1_LENGTH = 100;
export const MAX_HOME_ADDRESS_LINE2_LENGTH = 100;
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
  const {
    cacheUnionCard, createUnionCard, refreshUnionCard, removeUnionCard,
    unionCard,
  } = useUnionCard();
  const {
    email, employerName: cardEmployerName, homeAddressLine1, homeAddressLine2,
    name, phone,
  } = unionCard ?? {};
  const signedAt = (unionCard && ('signedAt' in unionCard))
    ? unionCard.signedAt : undefined;
  const setEmail = (e: string) => cacheUnionCard({ ...unionCard, email: e });
  const setEmployerName = (en: string) => cacheUnionCard({
    ...unionCard, employerName: en,
  });
  const setHomeAddressLine1 = (hal1: string) => cacheUnionCard({
    ...unionCard, homeAddressLine1: hal1,
  });
  const setHomeAddressLine2 = (hal2: string) => cacheUnionCard({
    ...unionCard, homeAddressLine2: hal2,
  });
  const setName = (n: string) => cacheUnionCard({ ...unionCard, name: n });
  const setPhone = (p: string) => cacheUnionCard({ ...unionCard, phone: p });

  const { org, refreshOrg, updateOrg } = useOrg();
  const { employerName: orgEmployerName, name: orgName } = org ?? {};
  const employerName = cardEmployerName || orgEmployerName;
  const agreement = unionCard?.agreement ?? `By tapping Sign, I authorize ${orgName || '__________'} to represent me for the purpose of collective bargaining with ${employerName || '__________'}`;

  const { can, refreshMyPermissions } = useMyPermissions({
    scopes: ['editOrg'],
  });

  const refresh = async () => {
    setRefreshing(true);
    setRefreshResult('none');

    try {
      await Promise.all([
        refreshOrg(), refreshUnionCard(), refreshMyPermissions(),
      ]);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setRefreshResult('error', {
        message: `${errorMessage}\nTap to try again`,
        onPress: refresh,
      });
    }

    setRefreshing(false);
  };

  useEffect(() => {
    if (!signedAt) {
      refresh().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (signedAt) {
      setSignOrUndoResult('success', {
        message: `Signed on ${formatDate(signedAt, 'dateOnlyShort')}`,
      });
    }
  }, [signedAt]);

  const sign = async () => {
    setSigningOrUndoing(true);
    setSignOrUndoResult('none');

    try {
      const [createUnionCardResult] = await Promise.allSettled([
        createUnionCard({ agreement, employerName }),
        can('editOrg') && (org?.employerName !== employerName) && updateOrg({
          employerName,
        }),
      ]);

      // Ignore updateOrg errors as long as createUnionCard succeeds
      if (createUnionCardResult.status === 'rejected') {
        const errorMessage = getErrorMessage(createUnionCardResult.reason);
        throw new Error(errorMessage);
      }
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
    homeAddressLine1,
    homeAddressLine2,
    name,
    orgEmployerName,
    phone,
    setEmail,
    setEmployerName,
    setHomeAddressLine1,
    setHomeAddressLine2,
    setName,
    setPhone,
    sign,
    signedAt,
    undo,
  };
}

type InputName = 'email' | 'employerName' | 'homeAddressLine1'
  | 'homeAddressLine2' | 'name' | 'phone';

type FocusedInputProps = {
  shouldHideEmployerNameInput: boolean;
};
function useFocusedInput({ shouldHideEmployerNameInput }: FocusedInputProps) {
  const [focusedInput, setFocusedInput] = useState<InputName | null>(null);

  function enterKeyHint(inputName: InputName): TextInputProps['enterKeyHint'] {
    const isLastVisibleInput = (inputName === 'employerName')
      || (inputName === 'homeAddressLine2' && shouldHideEmployerNameInput);
    return isLastVisibleInput ? 'done' : 'next';
  }

  const focused = (inputName: InputName) => (focusedInput === inputName);

  const onFocus = (inputName: InputName) => () => setFocusedInput(inputName);

  const onSubmitEditing = useCallback((inputName: InputName | null) => (() => {
    let nextInput: InputName | null = null;
    if (inputName === 'name') {
      nextInput = 'phone';
    } else if (inputName === 'phone') {
      nextInput = 'email';
    } else if (inputName === 'email') {
      nextInput = 'homeAddressLine1';
    } else if (inputName === 'homeAddressLine1') {
      nextInput = 'homeAddressLine2';
    } else if (inputName === 'homeAddressLine2') {
      nextInput = 'employerName';
    }
    setFocusedInput(nextInput);
  }), []);

  function submitBehavior(
    inputName: InputName,
  ): TextInputProps['submitBehavior'] {
    const shouldBlur = (inputName === 'employerName')
      || (inputName === 'homeAddressLine2' && shouldHideEmployerNameInput);
    return shouldBlur ? 'blurAndSubmit' : 'submit';
  }

  return {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  };
}

export default function UnionCardScreen() {
  const {
    loading: refreshing,
    RequestProgress: RefreshProgress,
    result: refreshingResult,
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
    agreement, email, employerName, homeAddressLine1, homeAddressLine2, name,
    orgEmployerName, phone, setEmail, setEmployerName, setHomeAddressLine1,
    setHomeAddressLine2, setName, setPhone, sign, signedAt, undo,
  } = useUnionCardInfo({
    setRefreshing, setRefreshResult, setSigningOrUndoing, setSignOrUndoResult,
  });
  const inputsEditable = !signingOrUndoing && !signedAt;
  const shouldHideEmployerNameInput = !!orgEmployerName;

  const { styles } = useStyles();
  const {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  } = useFocusedInput({ shouldHideEmployerNameInput });

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      <RefreshProgress />
      {!refreshing && (refreshingResult !== 'error') && (
        <>
          <View style={styles.section}>
            <HeaderText>Name</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect={false}
              autoFocus={false}
              editable={inputsEditable}
              enterKeyHint={enterKeyHint('name')}
              focused={focused('name')}
              maxLength={MAX_NAME_LENGTH}
              onChangeText={setName}
              onFocus={onFocus('name')}
              onSubmitEditing={onSubmitEditing('name')}
              placeholder="Abe Lincoln"
              submitBehavior={submitBehavior('name')}
              value={name}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Phone</HeaderText>
            <TextInputRow
              autoComplete="tel"
              autoFocus={false}
              editable={inputsEditable}
              enterKeyHint={enterKeyHint('phone')}
              focused={focused('phone')}
              keyboardType="phone-pad"
              maxLength={MAX_PHONE_LENGTH}
              onChangeText={setPhone}
              onFocus={onFocus('phone')}
              onSubmitEditing={onSubmitEditing('phone')}
              placeholder="5551234567"
              submitBehavior={submitBehavior('phone')}
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
              enterKeyHint={enterKeyHint('email')}
              focused={focused('email')}
              keyboardType="email-address"
              maxLength={MAX_EMAIL_LENGTH}
              onChangeText={setEmail}
              onFocus={onFocus('email')}
              onSubmitEditing={onSubmitEditing('email')}
              placeholder="email@example.com"
              submitBehavior={submitBehavior('email')}
              value={email}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>Home address</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoComplete="street-address"
              autoCorrect={false}
              autoFocus={false}
              editable={inputsEditable}
              enterKeyHint={enterKeyHint('homeAddressLine1')}
              focused={focused('homeAddressLine1')}
              maxLength={MAX_HOME_ADDRESS_LINE1_LENGTH}
              onChangeText={setHomeAddressLine1}
              onFocus={onFocus('homeAddressLine1')}
              onSubmitEditing={onSubmitEditing('homeAddressLine1')}
              placeholder="123 Main St, Unit 5"
              submitBehavior={submitBehavior('homeAddressLine1')}
              value={homeAddressLine1}
            />
            <TextInputRow
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={false}
              editable={inputsEditable}
              enterKeyHint={enterKeyHint('homeAddressLine2')}
              focused={focused('homeAddressLine2')}
              maxLength={MAX_HOME_ADDRESS_LINE2_LENGTH}
              onChangeText={setHomeAddressLine2}
              onFocus={onFocus('homeAddressLine2')}
              onSubmitEditing={onSubmitEditing('homeAddressLine2')}
              placeholder="Seattle, WA, 98111"
              submitBehavior={submitBehavior('homeAddressLine2')}
              value={homeAddressLine2}
            />
          </View>
          {!shouldHideEmployerNameInput && (
          <View style={styles.section}>
            <HeaderText>Employer name</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={false}
              editable={inputsEditable}
              enterKeyHint={enterKeyHint('employerName')}
              focused={focused('employerName')}
              maxLength={MAX_EMPLOYER_NAME_LENGTH}
              onChangeText={setEmployerName}
              onFocus={onFocus('employerName')}
              onSubmitEditing={onSubmitEditing('employerName')}
              placeholder="Acme, Inc."
              submitBehavior={submitBehavior('employerName')}
              value={employerName}
            />
          </View>
          )}
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
