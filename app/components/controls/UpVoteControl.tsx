import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import UpVoteButton from './UpVoteButton';
import {
  GENERIC_ERROR_MESSAGE, VoteState, isCurrentUserData, useUserContext,
} from '../../model';
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

  const [waitingForUp, setWaitingForUp] = useState<boolean>(false);
  const [waitingForDown, setWaitingForDown] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  const onVote = async ({
    previousVote, vote,
  }: { previousVote: VoteState, vote: VoteState }) => {
    if (!isCurrentUserData(currentUser)) { return; }

    setVoteState(vote);

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage;

    try {
      ({ errorMessage } = await createOrUpdateUpVote({
        commentId, jwt, postId, value: vote,
      }));
    } catch (error) {
      console.error(error);
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage) {
      console.error(errorMessage);
      setVoteState(previousVote);
    }
  };

  const onPress = async ({ isUpVote }: { isUpVote: boolean }) => {
    const activeVote = isUpVote ? 1 : -1;
    const setWaitingForMe = isUpVote ? setWaitingForUp : setWaitingForDown;
    const setWaitingForOther = isUpVote ? setWaitingForDown : setWaitingForUp;

    const previousVote = voteState;
    const vote = (previousVote === activeVote) ? 0 : activeVote;

    setWaitingForMe(true);
    if (previousVote === -1 * activeVote) {
      setWaitingForOther(true);
    }

    await onVote({ previousVote, vote });

    setWaitingForMe(false);
    setWaitingForOther(false);
  };

  return (
    <View>
      <UpVoteButton
        buttonStyle={[styles.button, styles.buttonUp]}
        fill={voteState === 1}
        onPress={() => onPress({ isUpVote: true })}
        waitingForResponse={waitingForUp}
      />
      <Text style={styles.text}>{score}</Text>
      <UpVoteButton
        buttonStyle={styles.button}
        fill={voteState === -1}
        flip
        onPress={() => onPress({ isUpVote: false })}
        waitingForResponse={waitingForDown}
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
