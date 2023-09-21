import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import { Comment, getMessageAge } from '../../model';
import UpvoteControl from './UpvoteControl';

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
  nestedDepth: number;
  item: Comment;
  onCommentChanged?: (comment: Comment) => void;
};

function CommentRow({ item, nestedDepth, onCommentChanged }: Props) {
  const {
    body, createdAt, id, myVote, pseudonym, score,
  } = item;
  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  const { nestedMarginStart, styles } = useStyles();
  const marginStart = nestedDepth * nestedMarginStart;

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
      </View>
    </View>
  );
}

CommentRow.defaultProps = {
  onCommentChanged: () => {},
};

export default memo(CommentRow);
