import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SegmentedControl from
  '@react-native-segmented-control/segmented-control';
import { useFocusedInput, useWorkGroups } from '../../model';
import { HeaderText } from '../views';
import { TextInputRow } from './text';
import useTheme from '../../Theme';

const MAX_DEPARTMENT_LENGTH = 100;
const MAX_JOB_TITLE_LENGTH = 100;
const SHIFTS = ['1st', '2nd', '3rd'];

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      rowGap: spacing.m,
    },
    section: {
      rowGap: spacing.s,
    },
  });

  return { styles };
};

export type WorkGroupFormInfo = {
  department?: string;
  jobTitle?: string;
  shift: string;
};

type Props = {
  onChange: (workGroupFormInfo: WorkGroupFormInfo) => void;
  workGroupId?: string;
};

export default function WorkGroupForm({ onChange, workGroupId }: Props) {
  const { getCachedWorkGroup } = useWorkGroups();
  const {
    department: initialDepartment,
    jobTitle: initialJobTitle,
    shift: initialShift,
  } = getCachedWorkGroup(workGroupId) ?? {};
  const initialShiftIndex = initialShift
    ? Math.max(0, SHIFTS.indexOf(initialShift)) : 0;

  const [
    department, setDepartment,
  ] = useState<string | undefined>(initialDepartment);
  const [
    jobTitle, setJobTitle,
  ] = useState<string | undefined>(initialJobTitle);
  const [shiftIndex, setShiftIndex] = useState(initialShiftIndex);

  useEffect(
    () => onChange({ department, jobTitle, shift: SHIFTS[shiftIndex] }),
    [department, jobTitle, shiftIndex],
  );

  const { styles } = useStyles();

  const {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  } = useFocusedInput({ orderedInputNames: ['jobTitle', 'department'] });

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <HeaderText>Job title</HeaderText>
        <TextInputRow
          autoCapitalize="words"
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
    </View>
  );
}
