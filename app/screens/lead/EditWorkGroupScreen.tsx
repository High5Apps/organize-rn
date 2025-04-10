import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { EditWorkGroupScreenProps } from '../../navigation';
import {
  KeyboardAvoidingScreenBackground, PrimaryButton, WorkGroupForm,
  WorkGroupFormInfo,
} from '../../components';
import useTheme from '../../Theme';

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
  });

  return { styles };
};

export default function EditWorkGroupScreen({
  route,
}: EditWorkGroupScreenProps) {
  const { workGroupId } = route.params;

  const [formInfo, setFormInfo] = useState<WorkGroupFormInfo>();
  const { department, jobTitle, shift } = formInfo ?? {};

  const onPublishPressed = useCallback(() => {
    console.log({ department, jobTitle, shift });
  }, [department, jobTitle, shift]);

  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScreenBackground
        contentContainerStyle={styles.contentContainerStyle}
      >
        <WorkGroupForm onChange={setFormInfo} workGroupId={workGroupId} />
      </KeyboardAvoidingScreenBackground>
      {jobTitle && (
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={onPublishPressed}
          style={styles.addButton}
        />
      )}
    </View>
  );
}
