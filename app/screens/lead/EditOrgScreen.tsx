import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, MultilineTextInput,
  PrimaryButton, TextInputRow, useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { getErrorMessage, NewOrgSteps, useOrg } from '../../model';
import { useTranslation } from '../../i18n';

const EMPLOYER_NAME_MAX_LENGTH = 50;

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
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
    multilineTextInput: {
      height: 100,
    },
    section: {
      rowGap: spacing.s,
    },
  });

  return { styles };
};

function useOrgInfo({
  setLoading, setResult,
}: Pick<ReturnType<typeof useRequestProgress>, 'setLoading' | 'setResult'>) {
  const [email, setEmail] = useState<string | undefined>('');
  const [employerName, setEmployerName] = useState<string | undefined>();
  const [memberDefinition, setMemberDefinition] = useState('');
  const [name, setName] = useState('');
  const [orgRefreshed, setOrgRefreshed] = useState(false);

  const { t } = useTranslation();

  const { org, refreshOrg, updateOrg } = useOrg();
  const refresh = async () => {
    setLoading(true);
    setResult('none');

    try {
      await refreshOrg();
      setOrgRefreshed(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', {
        message: `${errorMessage}\nTap to try again`,
        onPress: refresh,
      });
    }

    setLoading(false);
  };

  const updateOrgInfo = async () => {
    setLoading(true);
    setResult('none');
    Keyboard.dismiss();

    try {
      await updateOrg({
        email, employerName, memberDefinition, name,
      });
      setResult('success', { message: t('result.success.update.orgInfo') });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', { message: errorMessage });
    }
  };

  useEffect(() => { refresh().catch(console.error); }, []);

  useEffect(() => {
    if (!org) { return; }

    setEmail(org.email);
    setEmployerName(org.employerName);
    setMemberDefinition(org.memberDefinition);
    setName(org.name);
  }, [org]);

  return {
    email,
    employerName,
    memberDefinition,
    name,
    orgRefreshed,
    setEmail,
    setEmployerName,
    setMemberDefinition,
    setName,
    updateOrgInfo,
  };
}

export default function EditOrgScreen() {
  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress();
  const {
    email, employerName, memberDefinition, name, orgRefreshed, setEmail,
    setEmployerName, setMemberDefinition, setName, updateOrgInfo,
  } = useOrgInfo({ setLoading, setResult });

  const [nameStep, memberDefinitionStep, emailStep] = NewOrgSteps;
  const emailPlaceholder = useMemo(emailStep.placeholder, []);
  const namePlaceholder = useMemo(nameStep.placeholder, []);
  const definitionPlaceholder = useMemo(memberDefinitionStep.placeholder, []);

  const { styles } = useStyles();
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      {orgRefreshed && (
        <>
          <View style={styles.section}>
            <HeaderText>{nameStep.header}</HeaderText>
            <TextInputRow
              autoCapitalize={nameStep.autoCaptitalize}
              autoComplete={nameStep.autoComplete}
              autoCorrect={nameStep.autoCorrect}
              editable={!loading}
              enablesReturnKeyAutomatically
              keyboardType={nameStep.keyboardType}
              maxLength={nameStep.maxLength}
              onChangeText={setName}
              placeholder={namePlaceholder}
              returnKeyType="done"
              value={name}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>{emailStep.header}</HeaderText>
            <TextInputRow
              autoCapitalize={emailStep.autoCaptitalize}
              autoComplete={emailStep.autoComplete}
              autoCorrect={emailStep.autoCorrect}
              editable={!loading}
              enablesReturnKeyAutomatically
              keyboardType={emailStep.keyboardType}
              maxLength={emailStep.maxLength}
              onChangeText={setEmail}
              placeholder={emailPlaceholder}
              returnKeyType="done"
              value={email}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>{memberDefinitionStep.header}</HeaderText>
            <MultilineTextInput
              autoCapitalize={memberDefinitionStep.autoCaptitalize}
              autoComplete={memberDefinitionStep.autoComplete}
              autoCorrect={memberDefinitionStep.autoCorrect}
              editable={!loading}
              enablesReturnKeyAutomatically
              keyboardType={memberDefinitionStep.keyboardType}
              maxLength={memberDefinitionStep.maxLength}
              onChangeText={setMemberDefinition}
              placeholder={definitionPlaceholder}
              style={styles.multilineTextInput}
              submitBehavior="blurAndSubmit"
              returnKeyType="done"
              value={memberDefinition}
            />
          </View>
          <View style={styles.section}>
            <HeaderText>{t('object.employerName')}</HeaderText>
            <TextInputRow
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
              enablesReturnKeyAutomatically
              maxLength={EMPLOYER_NAME_MAX_LENGTH}
              onChangeText={setEmployerName}
              placeholder={t('placeholder.employerName')}
              returnKeyType="done"
              value={employerName}
            />
          </View>
          <PrimaryButton
            iconName="publish"
            label={t('action.publish')}
            onPress={updateOrgInfo}
            style={styles.button}
          />
        </>
      )}
      <RequestProgress />
    </KeyboardAvoidingScreenBackground>
  );
}
