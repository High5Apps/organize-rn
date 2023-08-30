import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import UpVoteButton from './UpVoteButton';
import { VoteState, isCurrentUserData, useUserContext } from '../../model';
import { createOrUpdateUpVote } from '../../networking';

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
  commentId?: string;
  initialScore?: number;
  initialVoteState?: VoteState;
  postId?: string;
};

export default function UpVoteControl({
  commentId, initialScore, initialVoteState, postId,
}: Props) {
  const { styles } = useStyles();

  const [voteState, setVoteState] = useState<VoteState>(initialVoteState ?? 0);
  const score = (initialScore ?? 0) + voteState;

  const { currentUser } = useUserContext();

  const onVote = async ({
    previousVote, vote,
  }: { previousVote: VoteState, vote: VoteState }) => {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { errorMessage } = await createOrUpdateUpVote({
      commentId, jwt, postId, value: vote,
    });

    if (errorMessage) {
      console.error(errorMessage);
      setVoteState(previousVote);
    }
  };

  return (
    <View>
      <UpVoteButton
        buttonStyle={[styles.button, styles.buttonUp]}
        fill={voteState === 1}
        onPress={() => {
          const vote = voteState === 1 ? 0 : 1;
          onVote({ previousVote: voteState, vote });
          setVoteState(vote);
        }}
      />
      <Text style={styles.text}>{score}</Text>
      <UpVoteButton
        buttonStyle={styles.button}
        fill={voteState === -1}
        flip
        onPress={() => {
          const vote = voteState === -1 ? 0 : -1;
          onVote({ previousVote: voteState, vote });
          setVoteState(vote);
        }}
      />
    </View>
  );
}

UpVoteControl.defaultProps = {
  commentId: undefined,
  initialScore: 0,
  initialVoteState: 0,
  postId: undefined,
};
