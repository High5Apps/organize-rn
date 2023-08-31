import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import useTheme from '../../Theme';
import UpVoteButton from './UpVoteButton';
import {
  GENERIC_ERROR_MESSAGE, VoteState, isCurrentUserData, truncateText, useUserContext,
} from '../../model';
import { createOrUpdateUpVote } from '../../networking';

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
  initialScore?: number;
  initialVoteState?: VoteState;
  postId?: string;
};

export default function UpVoteControl({
  commentId, errorItemFriendlyDifferentiator, initialScore, initialVoteState,
  postId,
}: Props) {
  const { styles } = useStyles();

  const [voteState, setVoteState] = useState<VoteState>(initialVoteState ?? 0);
  const score = (initialScore ?? 0) + voteState;

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
      showErrorAlert();
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
        softDisabled={waitingForResponse}
        waitingForResponse={waitingForUp}
      />
      <Text style={styles.text}>{score}</Text>
      <UpVoteButton
        buttonStyle={styles.button}
        fill={voteState === -1}
        flip
        onPress={() => onPress({ isUpVote: false })}
        softDisabled={waitingForResponse}
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
