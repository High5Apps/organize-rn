import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SegmentedControl from
  '@react-native-segmented-control/segmented-control';
import { NIL as NIL_UUID } from 'uuid';
import {
  HeaderText, KeyboardAvoidingScreenBackground, LearnMoreModal, PrimaryButton,
  SecondaryButton, TextInputRow,
} from '../../components';
import useTheme from '../../Theme';
import { useFocusedInput, useUnionCard, useWorkGroups } from '../../model';
import type { NewWorkGroupScreenProps } from '../../navigation';

const LEARN_MORE_BODY = 'A work group contains coworkers with the same job title, department, and shift.\n\nWork groups help represent your particular interests during contract negotiations.\n\nIf your workplace is small, your work groups might not have separate departments or shifts.';
const LEARN_MORE_HEADLINE = "What's a work group?";
const MAX_DEPARTMENT_LENGTH = 100;
const MAX_JOB_TITLE_LENGTH = 100;
const SHIFTS = ['1st', '2nd', '3rd'];

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    addButton: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    container: {
      flex: 1,
    },
    contentContainerStyle: {
      padding: spacing.m,
      paddingBottom: buttonBoundingBoxHeight,
      rowGap: spacing.m,
    },
    learnMoreButton: {
      alignSelf: 'center',
      paddingHorizontal: spacing.s,
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

export default function NewWorkGroupScreen({
  navigation,
}: NewWorkGroupScreenProps) {
  const { getCachedWorkGroup } = useWorkGroups();
  const {
    department: initialDepartment,
    jobTitle: initialJobTitle,
    shift: initialShift,
  } = getCachedWorkGroup(NIL_UUID) ?? {};
  const initialShiftIndex = initialShift
    ? Math.max(0, SHIFTS.indexOf(initialShift)) : 0;

  const [
    department, setDepartment,
  ] = useState<string | undefined>(initialDepartment);
  const [
    jobTitle, setJobTitle,
  ] = useState<string | undefined>(initialJobTitle);
  const [modalVisible, setModalVisible] = useState(false);
  const [shiftIndex, setShiftIndex] = useState(initialShiftIndex);

  const { cacheWorkGroup } = useWorkGroups();
  const { cacheUnionCard, unionCard } = useUnionCard();
  const onAddPressed = useCallback(() => {
    if (!jobTitle) {
      console.warn('Expected jobTitle to be set');
      return;
    }

    const shift = SHIFTS[shiftIndex];
    const workGroupId = NIL_UUID;
    cacheWorkGroup({
      department,
      id: workGroupId,
      isLocalOnly: true,
      jobTitle,
      memberCount: 1,
      shift,
    });
    cacheUnionCard({
      ...unionCard, department, jobTitle, shift, workGroupId,
    });

    navigation.popTo('UnionCard');
  }, [department, jobTitle, navigation, shiftIndex, unionCard]);

  const { styles } = useStyles();
  const {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  } = useFocusedInput({ orderedInputNames: ['jobTitle', 'department'] });

  return (
    <View style={styles.container}>
      <LearnMoreModal
        body={LEARN_MORE_BODY}
        headline={LEARN_MORE_HEADLINE}
        iconName="groups"
        setVisible={setModalVisible}
        visible={modalVisible}
      />
      <KeyboardAvoidingScreenBackground
        contentContainerStyle={styles.contentContainerStyle}
      >
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
        <SecondaryButton
          iconName="help-outline"
          label="Learn More"
          onPress={() => setModalVisible(true)}
          style={styles.learnMoreButton}
        />
      </KeyboardAvoidingScreenBackground>
      {jobTitle && (
        <PrimaryButton
          iconName="add"
          label="Add"
          onPress={onAddPressed}
          style={styles.addButton}
        />
      )}
    </View>
  );
}
