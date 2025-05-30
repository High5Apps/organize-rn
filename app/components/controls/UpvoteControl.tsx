import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import useTheme from '../../Theme';
import { UpvoteButton } from './buttons';
import {
  VoteState, getErrorMessage, truncateText, useUpvote,
} from '../../model';
import { useTranslation } from '../../i18n';

const ERROR_ITEM_FRIENDLY_DIFFERENTIATOR_MAX_LENGTH = 30;

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
  disabled?: boolean;
  errorItemFriendlyDifferentiator: string;
  onVoteChanged?: (vote: VoteState, score: number) => void;
  postId?: string;
  score: number;
  voteState: VoteState;
};

export default function UpvoteControl({
  commentId, disabled = false, errorItemFriendlyDifferentiator,
  onVoteChanged = () => {}, postId, score, voteState,
}: Props) {
  const { styles } = useStyles();
  const { t } = useTranslation();

  const [waitingForUp, setWaitingForUp] = useState<boolean>(false);
  const [waitingForDown, setWaitingForDown] = useState<boolean>(false);
  const waitingForResponse = waitingForUp || waitingForDown;

  const { createUpvote, waitingForVoteSate } = useUpvote({ commentId, postId });

  const showErrorAlert = (errorMessage: string) => {
    const upvotableType = t(postId ? 'object.discussion' : 'object.comment');
    const preview = truncateText({
      maxLength: ERROR_ITEM_FRIENDLY_DIFFERENTIATOR_MAX_LENGTH,
      text: errorItemFriendlyDifferentiator,
    });
    const message = t('result.error.upvotable', {
      errorMessage, preview, upvotableType,
    });
    Alert.alert(t('result.error.upvote'), message);
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

    try {
      await createUpvote({ vote });
      const voteDelta = (vote - previousVote);
      const updatedScore = score + voteDelta;
      onVoteChanged?.(vote, updatedScore);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showErrorAlert(errorMessage);
    }

    setWaitingForMe(false);
    setWaitingForOther(false);
  };

  return (
    <View>
      <UpvoteButton
        buttonStyle={[styles.button, styles.buttonUp]}
        fill={waitingForUp ? (waitingForVoteSate === 1) : (voteState === 1)}
        onPress={() => onPress({ isUpvote: true })}
        showDisabled={waitingForUp || disabled}
        softDisabled={waitingForResponse || disabled}
      />
      <Text style={styles.text}>{score}</Text>
      <UpvoteButton
        buttonStyle={styles.button}
        fill={waitingForDown ? (waitingForVoteSate === -1) : (voteState === -1)}
        flip
        onPress={() => onPress({ isUpvote: false })}
        showDisabled={waitingForDown || disabled}
        softDisabled={waitingForResponse || disabled}
      />
    </View>
  );
}
