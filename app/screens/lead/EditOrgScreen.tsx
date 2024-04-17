import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  ScrollView, StyleSheet, TextInput, View,
} from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, MultilineTextInput,
  PrimaryButton, TextInputRow, useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { GENERIC_ERROR_MESSAGE, NewOrgSteps, useOrg } from '../../model';

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
  const [memberDefinition, setMemberDefinition] = useState('');
  const [name, setName] = useState('');

  const { org, refreshOrg } = useOrg();
  const refresh = async () => {
    setLoading(true);
    setResult('none');

    try {
      await refreshOrg();
    } catch (error) {
      let errorMessage = GENERIC_ERROR_MESSAGE;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
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

    setMemberDefinition(org.memberDefinition);
    setName(org.name);
  }, [org]);

  return {
    memberDefinition, name, org, setMemberDefinition, setName,
  };
}

export default function EditOrgScreen() {
  const { RequestProgress, setLoading, setResult } = useRequestProgress();
  const {
    memberDefinition, name, org, setMemberDefinition, setName,
  } = useOrgInfo({ setLoading, setResult });

  const ref = useRef<TextInput>(null);

  const [nameStep, memberDefinitionStep] = NewOrgSteps;
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
                blurOnSubmit={false}
                enablesReturnKeyAutomatically
                maxLength={nameStep.maxLength}
                onChangeText={setName}
                onSubmitEditing={() => ref.current?.focus()}
                placeholder={namePlaceholder}
                returnKeyType="next"
                value={name}
              />
            </View>
            <View style={styles.section}>
              <HeaderText>Org memeber definition</HeaderText>
              <MultilineTextInput
                blurOnSubmit
                enablesReturnKeyAutomatically
                maxLength={memberDefinitionStep.maxLength}
                onChangeText={setMemberDefinition}
                placeholder={definitionPlaceholder}
                style={styles.multilineTextInput}
                ref={ref}
                returnKeyType="done"
                value={memberDefinition}
              />
            </View>
            <PrimaryButton
              iconName="publish"
              label="Publish"
              onPress={() => console.log('press')}
              style={styles.button}
            />
          </>
        )}
        <RequestProgress />
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
