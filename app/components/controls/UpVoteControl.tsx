import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import UpVoteButton from './UpVoteButton';
import { VoteState } from '../../model';

const useStyles = () => {
  const { colors, font, sizes } = useTheme();

  const styles = StyleSheet.create({
    button: {
      height: sizes.minimumTappableLength,
      width: sizes.minimumTappableLength,
    },
    buttonUp: {
      justifyContent: 'flex-end',
    },
    text: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  initialScore?: number;
  initialVoteState?: VoteState;
  onVote?: (voteState: VoteState) => void;
};

export default function UpVoteControl({
  initialScore, initialVoteState, onVote,
}: Props) {
  const { styles } = useStyles();

  const [voteState, setVoteState] = useState<VoteState>(initialVoteState ?? 0);
  const score = (initialScore ?? 0) + voteState;

  return (
    <View>
      <UpVoteButton
        buttonStyle={[styles.button, styles.buttonUp]}
        fill={voteState === 1}
        onPress={() => {
          const vote = voteState === 1 ? 0 : 1;
          setVoteState(vote);
          onVote?.(vote);
        }}
      />
      <Text style={styles.text}>{score}</Text>
      <UpVoteButton
        buttonStyle={styles.button}
        fill={voteState === -1}
        flip
        onPress={() => {
          const vote = voteState === -1 ? 0 : -1;
          setVoteState(vote);
          onVote?.(vote);
        }}
      />
    </View>
  );
}

UpVoteControl.defaultProps = {
  initialScore: 0,
  initialVoteState: 0,
  onVote: () => {},
};
