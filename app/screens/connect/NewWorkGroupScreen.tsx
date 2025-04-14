import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NIL as NIL_UUID } from 'uuid';
import {
  KeyboardAvoidingScreenBackground, LearnMoreModal, PrimaryButton,
  SecondaryButton, WorkGroupForm, WorkGroupFormInfo,
} from '../../components';
import useTheme from '../../Theme';
import {
  sanitizeSingleLineField, useUnionCard, useWorkGroups,
} from '../../model';
import type { NewWorkGroupScreenProps } from '../../navigation';

const LEARN_MORE_BODY = 'A work group contains coworkers with the same job title, department, and shift.\n\nWork groups help represent your particular interests during contract negotiations.\n\nIf your workplace is small, your work groups might not have separate departments or shifts.';
const LEARN_MORE_HEADLINE = "What's a work group?";
const NEW_WORK_GROUP_ID = NIL_UUID;

const useStyles = () => {
  const { sizes, spacing } = useTheme();

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
  });

  return { styles };
};

export default function NewWorkGroupScreen({
  navigation,
}: NewWorkGroupScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [formInfo, setFormInfo] = useState<WorkGroupFormInfo>();
  const { department, jobTitle, shift } = formInfo ?? {};

  const { cacheWorkGroup } = useWorkGroups();
  const { cacheUnionCard, unionCard } = useUnionCard();
  const onAddPressed = useCallback(() => {
    if (!jobTitle || !shift) {
      console.warn('Expected jobTitle and shift to be set');
      return;
    }

    const workGroupId = NEW_WORK_GROUP_ID;
    const sanitizedDepartment = sanitizeSingleLineField(department);
    const sanitizedJobTitle = sanitizeSingleLineField(jobTitle);
    cacheWorkGroup({
      department: sanitizedDepartment,
      id: workGroupId,
      isLocalOnly: true,
      jobTitle: sanitizedJobTitle!,
      memberCount: 1,
      shift,
    });
    cacheUnionCard({
      ...unionCard,
      department: sanitizedDepartment,
      jobTitle: sanitizedJobTitle,
      shift,
      workGroupId,
    });

    navigation.popTo('UnionCard');
  }, [department, jobTitle, navigation, shift, unionCard]);

  const { styles } = useStyles();

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
        <WorkGroupForm onChange={setFormInfo} workGroupId={NEW_WORK_GROUP_ID} />
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
