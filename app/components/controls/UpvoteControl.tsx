import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import useTheme from '../../Theme';
import UpvoteButton from './UpvoteButton';
import {
  GENERIC_ERROR_MESSAGE, VoteState, truncateText, useUserContext,
} from '../../model';
import { createOrUpdateUpvote } from '../../networking';

const ERROR_ITEM_FRIENDLY_DIFFERENTIATOR_MAX_LENGTH = 30;
const ERROR_ALERT_TITLE = 'Upvote or Downvote failed. Please try again.';

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
  errorItemFriendlyDifferentiator: string;
  onVoteChanged?: (vote: VoteState, score: number) => void;
  postId?: string;
  score: number;
  voteState: VoteState;
};

export default function UpvoteControl({
  commentId, errorItemFriendlyDifferentiator, onVoteChanged, postId, score,
  voteState,
}: Props) {
  const { styles } = useStyles();

  const [
    waitingForVoteSate, setWaitingForVoteSate,
  ] = useState<VoteState | null>(null);
  const [waitingForUp, setWaitingForUp] = useState<boolean>(false);
  const [waitingForDown, setWaitingForDown] = useState<boolean>(false);
  const waitingForResponse = waitingForUp || waitingForDown;

  const { currentUser } = useUserContext();

  const showErrorAlert = () => {
    const upvotableType = postId ? 'Post' : 'Comment';
    const preview = truncateText({
      maxLength: ERROR_ITEM_FRIENDLY_DIFFERENTIATOR_MAX_LENGTH,
      text: errorItemFriendlyDifferentiator,
    });
    const message = `${upvotableType}: ${preview}`;
    Alert.alert(ERROR_ALERT_TITLE, message);
  };

  const onVote = async ({
    previousVote, vote,
  }: { previousVote: VoteState, vote: VoteState }) => {
    if (!currentUser) { return; }

    setWaitingForVoteSate(vote);

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage;

    try {
      ({ errorMessage } = await createOrUpdateUpvote({
        commentId, jwt, postId, value: vote,
      }));
    } catch (error) {
      console.error(error);
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    setWaitingForVoteSate(null);

    if (errorMessage) {
      console.error(errorMessage);
      showErrorAlert();
      return;
    }

    const voteDelta = (vote - previousVote);
    const updatedScore = score + voteDelta;
    onVoteChanged?.(vote, updatedScore);
  };

  const onPress = async ({ isUpvote }: { isUpvote: boolean }) => {
    const activeVote = isUpvote ? 1 : -1;
    const setWaitingForMe = isUpvote ? setWaitingForUp : setWaitingForDown;
    const setWaitingForOther = isUpvote ? setWaitingForDown : setWaitingForUp;

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
      <UpvoteButton
        buttonStyle={[styles.button, styles.buttonUp]}
        fill={waitingForUp ? (waitingForVoteSate === 1) : (voteState === 1)}
        onPress={() => onPress({ isUpvote: true })}
        softDisabled={waitingForResponse}
        waitingForResponse={waitingForUp}
      />
      <Text style={styles.text}>{score}</Text>
      <UpvoteButton
        buttonStyle={styles.button}
        fill={waitingForDown ? (waitingForVoteSate === -1) : (voteState === -1)}
        flip
        onPress={() => onPress({ isUpvote: false })}
        softDisabled={waitingForResponse}
        waitingForResponse={waitingForDown}
      />
    </View>
  );
}

UpvoteControl.defaultProps = {
  commentId: undefined,
  onVoteChanged: () => {},
  postId: undefined,
};
