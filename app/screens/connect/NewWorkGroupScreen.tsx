import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';
import SegmentedControl from
  '@react-native-segmented-control/segmented-control';
import { NIL as NIL_UUID } from 'uuid';
import {
  HeaderText, KeyboardAvoidingScreenBackground, PrimaryButton, TextInputRow,
} from '../../components';
import useTheme from '../../Theme';
import { useUnionCard } from '../../model';
import type { NewWorkGroupScreenProps } from '../../navigation';

const MAX_DEPARTMENT_LENGTH = 100;
const MAX_JOB_TITLE_LENGTH = 100;
const SHIFTS = ['1st', '2nd', '3rd'];

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-end',
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
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

type InputName = 'department' | 'jobTitle';

function useFocusedInput() {
  const LAST_INPUT = 'department';
  const [focusedInput, setFocusedInput] = useState<InputName | null>(null);

  function enterKeyHint(inputName: InputName): TextInputProps['enterKeyHint'] {
    return (inputName === LAST_INPUT) ? 'done' : 'next';
  }

  const focused = (inputName: InputName) => (focusedInput === inputName);

  const onFocus = (inputName: InputName) => () => setFocusedInput(inputName);

  const onSubmitEditing = useCallback((inputName: InputName | null) => (() => {
    let nextInput: InputName | null = null;
    if (inputName === 'jobTitle') {
      nextInput = 'department';
    }
    setFocusedInput(nextInput);
  }), []);

  function submitBehavior(
    inputName: InputName,
  ): TextInputProps['submitBehavior'] {
    return (inputName === LAST_INPUT) ? 'blurAndSubmit' : 'submit';
  }

  return {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  };
}

export default function NewWorkGroupScreen({
  navigation,
}: NewWorkGroupScreenProps) {
  const [department, setDepartment] = useState<string>();
  const [jobTitle, setJobTitle] = useState<string>();
  const [shiftIndex, setShiftIndex] = useState(0);

  const { cacheUnionCard, unionCard } = useUnionCard();
  const onAddPressed = useCallback(() => {
    if (!jobTitle) {
      console.warn('Expected jobTitle to be set');
      return;
    }

    cacheUnionCard({
      ...unionCard,
      department,
      jobTitle,
      shift: SHIFTS[shiftIndex],
      workGroupId: NIL_UUID,
    });
    navigation.popTo('UnionCard');
  }, [department, jobTitle, navigation, shiftIndex, unionCard]);

  const { styles } = useStyles();
  const {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  } = useFocusedInput();

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <HeaderText>Job title</HeaderText>
        <TextInputRow
          autoCapitalize="words"
          autoFocus={false}
          enterKeyHint={enterKeyHint('jobTitle')}
          focused={focused('jobTitle')}
          maxLength={MAX_JOB_TITLE_LENGTH}
          onChangeText={setJobTitle}
          onFocus={onFocus('jobTitle')}
          onSubmitEditing={onSubmitEditing('jobTitle')}
          placeholder="Nurse Practitioner"
          submitBehavior={submitBehavior('jobTitle')}
          value={jobTitle}
        />
      </View>
      <View style={styles.section}>
        <HeaderText>Department (optional)</HeaderText>
        <TextInputRow
          autoCapitalize="words"
          autoFocus={false}
          enterKeyHint={enterKeyHint('department')}
          focused={focused('department')}
          maxLength={MAX_DEPARTMENT_LENGTH}
          onChangeText={setDepartment}
          onFocus={onFocus('department')}
          onSubmitEditing={onSubmitEditing('department')}
          placeholder="Intensive Care"
          submitBehavior={submitBehavior('department')}
          value={department}
        />
      </View>
      <View style={styles.section}>
        <HeaderText>Shift</HeaderText>
        <SegmentedControl
          onChange={({ nativeEvent: { selectedSegmentIndex } }) => {
            setShiftIndex(selectedSegmentIndex);
          }}
          selectedIndex={shiftIndex}
          values={SHIFTS}
        />
      </View>
      {jobTitle && (
        <PrimaryButton
          iconName="add"
          label="Add"
          onPress={onAddPressed}
          style={styles.button}
        />
      )}
    </KeyboardAvoidingScreenBackground>
  );
}
