import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import { Comment, getMessageAge } from '../../model';
import UpvoteControl from './UpvoteControl';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

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

  return { styles };
};

type Props = {
  item: Comment;
};

function CommentRow({ item }: Props) {
  const {
    body, createdAt, id, pseudonym, score,
  } = item;
  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <UpvoteControl
        commentId={id}
        errorItemFriendlyDifferentiator={body}
        score={score}
        voteState={0}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{body}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default memo(CommentRow);
