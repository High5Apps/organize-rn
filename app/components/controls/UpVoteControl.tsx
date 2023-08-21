import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import UpVoteButton from './UpVoteButton';

const buttonSize = 44;

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: buttonSize,
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

type VoteState = -1 | 0 | 1;

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
    <View style={styles.container}>
      <UpVoteButton
        buttonSize={buttonSize}
        fill={voteState === 1}
        onPress={() => {
          const vote = voteState === 1 ? 0 : 1;
          setVoteState(vote);
          onVote?.(vote);
        }}
      />
      <Text style={styles.text}>{score}</Text>
      <UpVoteButton
        buttonSize={buttonSize}
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
