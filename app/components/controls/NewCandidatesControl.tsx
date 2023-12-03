import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextInputRow from './TextInputRow';
import TextButton from './TextButton';
import useTheme from '../../Theme';
import { ConfirmationAlert } from '../../model';

const useStyles = () => {
  const { font, spacing } = useTheme();

  const styles = StyleSheet.create({
    addChoiceButtonContainer: {
      alignSelf: 'flex-start',
      marginStart: spacing.m,
      marginTop: spacing.m,
      marginBottom: spacing.s,
    },
    addChoiceButtonText: {
      fontSize: font.sizes.body,
    },
  });

  return { styles };
};

type Props = {
  candidates: string[];
  setCandidates: (candidates: string[]) => void;
};

export default function NewCandidatesControl({
  candidates, setCandidates,
}: Props) {
  const { styles } = useStyles();
  return (
    <View>
      {candidates.map((candidate, i) => (
        <TextInputRow
          iconEndDisabled={candidates[i + 1] === undefined}
          iconEndName="close"
          iconEndOnPress={ConfirmationAlert({
            destructiveAction: 'Remove',
            destructiveActionInTitle: 'remove this choice',
            onConfirm: () => setCandidates([
              ...candidates.slice(0, i),
              ...candidates.slice(i + 1),
            ]),
          }).show}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          onChangeText={(text) => setCandidates([
            ...candidates.slice(0, i),
            text,
            ...candidates.slice(i + 1),
          ])}
          placeholder={`Choice ${1 + i}`}
          value={candidate}
        />
      ))}
      <TextButton
        containerStyle={styles.addChoiceButtonContainer}
        disabled={!candidates?.at(-1)?.length}
        onPress={() => setCandidates([...candidates, ''])}
        style={styles.addChoiceButtonText}
      >
        Add another choice
      </TextButton>
    </View>
  );
}
