import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextButton,
  TextInputRow, useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import {
  formatDate, getErrorMessage, isDefined, useFocusedInput, useMyPermissions,
  useOrg, useUnionCard,
} from '../../model';
import type { UnionCardScreenProps } from '../../navigation';

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
      marginHorizontal: spacing.m,
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
    textButtonEdit: {
      textAlign: 'right',
    },
    textSecondary: {
      color: colors.labelSecondary,
    },
    workGroupDescription: {
      flex: 1,
    },
    workGroupDescriptionRow: {
      flexDirection: 'row',
      marginStart: spacing.m,
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
    department, email, employerName: cardEmployerName, homeAddressLine1,
    homeAddressLine2, jobTitle, name, phone, shift,
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
  const workGroupDescription = !jobTitle ? undefined : [
    jobTitle, `${shift} shift`, department,
  ].filter(isDefined).join(', ');

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
    workGroupDescription,
  };
}

export default function UnionCardScreen({ navigation }: UnionCardScreenProps) {
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
    workGroupDescription,
  } = useUnionCardInfo({
    setRefreshing, setRefreshResult, setSigningOrUndoing, setSignOrUndoResult,
  });
  const inputsEditable = !signingOrUndoing && !signedAt;
  const shouldHideEmployerNameInput = !!orgEmployerName;

  const { styles } = useStyles();
  const {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  } = useFocusedInput({
    orderedInputNames: [
      'name', 'phone', 'email', 'homeAddressLine1', 'homeAddressLine2',
      shouldHideEmployerNameInput ? undefined : 'employerName',
    ].filter(isDefined),
  });

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
            <HeaderText>Work group</HeaderText>
            <View style={styles.workGroupDescriptionRow}>
              {workGroupDescription && (
                <Text style={[styles.text, styles.workGroupDescription]}>
                  {workGroupDescription}
                </Text>
              )}
              <TextButton
                disabled={!inputsEditable}
                onPress={() => navigation.navigate('SelectWorkGroup')}
                style={workGroupDescription && styles.textButtonEdit}
              >
                {workGroupDescription ? 'Edit' : 'Select your work group'}
              </TextButton>
            </View>
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
