import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { EditWorkGroupScreenProps } from '../../navigation';
import {
  KeyboardAvoidingScreenBackground, PrimaryButton, useRequestProgress,
  WorkGroupForm, WorkGroupFormInfo,
} from '../../components';
import useTheme from '../../Theme';
import { useWorkGroup } from '../../model';
import { useTranslation } from '../../i18n';

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
  navigation, route,
}: EditWorkGroupScreenProps) {
  const { workGroupId } = route.params;

  const [formInfo, setFormInfo] = useState<WorkGroupFormInfo>();
  const { department, jobTitle, shift } = formInfo ?? {};

  const { updateWorkGroup } = useWorkGroup(workGroupId);

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const onPublishPressed = useCallback(async () => {
    setLoading(true);
    setResult('none');

    try {
      await updateWorkGroup({ department, jobTitle, shift });
      setResult('success');
      navigation.goBack();
    } catch (error) {
      setResult('error', { error });
    }
  }, [department, jobTitle, navigation, shift]);

  const { styles } = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScreenBackground
        contentContainerStyle={styles.contentContainerStyle}
      >
        <WorkGroupForm onChange={setFormInfo} workGroupId={workGroupId} />
        <RequestProgress />
      </KeyboardAvoidingScreenBackground>
      {jobTitle && (
        <PrimaryButton
          iconName="publish"
          label={t('action.publish')}
          onPress={onPublishPressed}
          style={styles.addButton}
        />
      )}
    </View>
  );
}
