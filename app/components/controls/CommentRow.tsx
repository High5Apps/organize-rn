import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../Theme';
import { Comment, getMessageAge } from '../../model';
import UpvoteControl from './UpvoteControl';
import TextButton from './TextButton';
import type { PostScreenProps } from '../../navigation';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const nestedMarginStart = sizes.nestingMargin;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      flexDirection: 'row',
      paddingStart: spacing.s,
      paddingEnd: spacing.m,
      paddingVertical: spacing.xs,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      paddingVertical: spacing.s,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { nestedMarginStart, styles };
};

type Props = {
  disableReply?: boolean;
  item: Comment;
  onCommentChanged?: (comment: Comment) => void;
};

function CommentRow({ disableReply, item, onCommentChanged }: Props) {
  const {
    body, createdAt, depth, id, myVote, pseudonym, score,
  } = item;
  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  const { nestedMarginStart, styles } = useStyles();
  const marginStart = depth * nestedMarginStart;

  const navigation = useNavigation<PostScreenProps['navigation']>();
  const onReplyPress = useCallback(() => {
    navigation.navigate('NewReply', { commentId: id });
  }, [id, navigation]);

  return (
    <View style={[styles.container, { marginStart }]}>
      <UpvoteControl
        commentId={id}
        errorItemFriendlyDifferentiator={body}
        onVoteChanged={(updatedVote, updatedScore) => {
          onCommentChanged?.({
            ...item,
            myVote: updatedVote,
            score: updatedScore,
          });
        }}
        score={score}
        voteState={myVote}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{body}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {!disableReply && <TextButton onPress={onReplyPress}>Reply</TextButton>}
      </View>
    </View>
  );
}

CommentRow.defaultProps = {
  disableReply: false,
  onCommentChanged: () => {},
};

export default memo(CommentRow);
