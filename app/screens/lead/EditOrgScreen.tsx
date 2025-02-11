import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard, ScrollView, StyleSheet, View,
} from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, MultilineTextInput,
  PrimaryButton, TextInputRow, useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { getErrorMessage, NewOrgSteps, useOrg } from '../../model';

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
      flex: 1,
      margin: spacing.m,
      rowGap: spacing.m,
    },
    multilineTextInput: {
      height: 100,
    },
    scrollView: {
      flex: 1,
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
  const [memberDefinition, setMemberDefinition] = useState('');
  const [name, setName] = useState('');

  const { org, refreshOrg, updateOrg } = useOrg();
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

  const updateOrgInfo = async () => {
    setLoading(true);
    setResult('none');
    Keyboard.dismiss();

    try {
      await updateOrg({ email, memberDefinition, name });
      setResult('success', { message: 'Successfully updated Org info' });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setResult('error', { message: errorMessage });
    }
  };

  useEffect(() => { refresh().catch(console.error); }, []);

  useEffect(() => {
    if (!org) { return; }

    setEmail(org.email);
    setMemberDefinition(org.memberDefinition);
    setName(org.name);
  }, [org]);

  return {
    email,
    memberDefinition,
    name,
    org,
    setEmail,
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
    email, memberDefinition, name, org, setEmail, setMemberDefinition, setName,
    updateOrgInfo,
  } = useOrgInfo({ setLoading, setResult });

  const [nameStep, memberDefinitionStep, emailStep] = NewOrgSteps;
  const emailPlaceholder = useMemo(emailStep.placeholder, []);
  const namePlaceholder = useMemo(nameStep.placeholder, []);
  const definitionPlaceholder = useMemo(memberDefinitionStep.placeholder, []);

  const { styles } = useStyles();

  return (
    <KeyboardAvoidingScreenBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        {org && (
          <>
            <View style={styles.section}>
              <HeaderText>Org name</HeaderText>
              <TextInputRow
                autoFocus={false}
                editable={!loading}
                enablesReturnKeyAutomatically
                maxLength={nameStep.maxLength}
                onChangeText={setName}
                placeholder={namePlaceholder}
                returnKeyType="done"
                value={name}
              />
            </View>
            <View style={styles.section}>
              <HeaderText>Org email</HeaderText>
              <TextInputRow
                autoFocus={false}
                editable={!loading}
                enablesReturnKeyAutomatically
                maxLength={emailStep.maxLength}
                onChangeText={setEmail}
                placeholder={emailPlaceholder}
                returnKeyType="done"
                value={email}
              />
            </View>
            <View style={styles.section}>
              <HeaderText>Org memeber definition</HeaderText>
              <MultilineTextInput
                editable={!loading}
                enablesReturnKeyAutomatically
                maxLength={memberDefinitionStep.maxLength}
                onChangeText={setMemberDefinition}
                placeholder={definitionPlaceholder}
                style={styles.multilineTextInput}
                submitBehavior="blurAndSubmit"
                returnKeyType="done"
                value={memberDefinition}
              />
            </View>
            <PrimaryButton
              iconName="publish"
              label="Publish"
              onPress={updateOrgInfo}
              style={styles.button}
            />
          </>
        )}
        <RequestProgress />
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
