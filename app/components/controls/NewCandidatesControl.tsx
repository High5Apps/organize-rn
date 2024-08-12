import React, { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextInputRow } from './text';
import { TextButton } from './buttons';
import useTheme from '../../Theme';
import { ConfirmationAlert } from './modals';

const MAX_TITLE_LENGTH = 60;

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    addChoiceButtonContainer: {
      alignSelf: 'flex-start',
      marginStart: spacing.m,
      marginTop: spacing.m,
      marginBottom: spacing.s,
    },
  });

  return { styles };
};

type Props = {
  candidates: string[];
  disabled?: boolean;
  setCandidates: (candidates: string[]) => void;
};

export default function NewCandidatesControl({
  candidates, disabled, setCandidates,
}: Props) {
  const [
    focusedInputIndex, setFocusedInputIndex,
  ] = useState<number | null>(null);

  const appendNewCandidate = () => setCandidates([...candidates, '']);

  const { styles } = useStyles();
  return (
    <View>
      {candidates.map((candidate, i) => (
        <TextInputRow
          autoFocus={false}
          blurOnSubmit={false}
          editable={!disabled}
          focused={focusedInputIndex === i}
          iconEndDisabled={disabled || candidates.length === 1}
          iconEndName="close"
          iconEndOnPress={() => {
            const removeCandidate = () => setCandidates([
              ...candidates.slice(0, i),
              ...candidates.slice(i + 1),
            ]);
            if (!candidate.length) {
              removeCandidate();
            } else {
              ConfirmationAlert({
                destructiveAction: 'Remove',
                destructiveActionInTitle: `remove this choice: "${candidate}"`,
                onConfirm: removeCandidate,
              }).show();
            }
          }}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          maxLength={MAX_TITLE_LENGTH}
          onChangeText={(text) => setCandidates([
            ...candidates.slice(0, i),
            text,
            ...candidates.slice(i + 1),
          ])}
          onFocus={() => setFocusedInputIndex(i)}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            if (focusedInputIndex === null) { return; }

            const isOnLastInput = i === candidates.length - 1;
            if (!isOnLastInput) {
              setFocusedInputIndex(focusedInputIndex + 1);
              return;
            }

            if (!text) {
              setFocusedInputIndex(null);
              Keyboard.dismiss();
            } else {
              appendNewCandidate();
              setFocusedInputIndex(focusedInputIndex + 1);
            }
          }}
          placeholder={`Choice ${1 + i}`}
          value={candidate}
        />
      ))}
      <TextButton
        containerStyle={styles.addChoiceButtonContainer}
        disabled={disabled || !candidates[candidates.length - 1]?.length}
        onPress={appendNewCandidate}
      >
        Add another choice
      </TextButton>
    </View>
  );
}

NewCandidatesControl.defaultProps = {
  disabled: false,
};
