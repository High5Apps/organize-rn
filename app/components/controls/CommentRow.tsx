import React, { memo, useCallback } from 'react';
import {
  ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../Theme';
import {
  Comment, MAX_COMMENT_DEPTH, getMessageAge, useUserContext,
} from '../../model';
import UpvoteControl from './UpvoteControl';
import TextButton from './TextButton';
import type { PostScreenProps } from '../../navigation';

export function getSubtitle({ createdAt, pseudonym }: Comment): string {
  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;
  return subtitle;
}

export const useCommentRowStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const { width: screenWidth } = useWindowDimensions();

  // The deepest comment width should be at least 2/3 of the screen width
  const nestedMarginStart = (screenWidth / 3) / (MAX_COMMENT_DEPTH - 1);

  const containerPaddingStart = spacing.s;
  const upvoteControlWidth = sizes.minimumTappableLength;
  const separatorHeight = sizes.separator;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      // backgroundColor: 'green',
      flexDirection: 'row',
      paddingEnd: spacing.m,
      paddingVertical: spacing.xs,
    },
    highlightOff: {
      paddingStart: containerPaddingStart,
    },
    highlightOn: {
      borderColor: colors.primary,
      borderStartWidth: containerPaddingStart,
    },
    innerContainer: {
      // backgroundColor: 'yellow',
      flex: 1,
      flexDirection: 'column',
      paddingVertical: spacing.s,
    },
    scrollViewContainer: {
      maxHeight: 120,
    },
    subtitle: {
      // backgroundColor: 'red',
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
    },
    textButtonRow: {
      flexDirection: 'row',
      columnGap: spacing.s,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return {
    colors,
    containerPaddingStart,
    nestedMarginStart,
    screenWidth,
    separatorHeight,
    styles,
    upvoteControlWidth,
  };
};

type Props = {
  compactView?: boolean;
  disableDepthIndent?: boolean;
  enableBodyTextSelection?: boolean;
  hideTextButtonRow?: boolean;
  item: Comment;
  onCommentChanged?: (comment: Comment) => void;
  postId: string;
};

function CommentRow({
  compactView, disableDepthIndent, enableBodyTextSelection, hideTextButtonRow,
  item, onCommentChanged, postId,
}: Props) {
  const {
    body, depth, id, myVote, score, userId,
  } = item;

  const { currentUser } = useUserContext();
  const highlighted = userId === currentUser?.id;

  // MAX_COMMENT_DEPTH - 1 because depth is 0-indexed
  const disableReply = depth >= (MAX_COMMENT_DEPTH - 1);

  const subtitle = getSubtitle(item);

  const { colors, nestedMarginStart, styles } = useCommentRowStyles();
  // const marginStart = disableDepthIndent ? 0 : depth * nestedMarginStart;
  const marginStart = 0;

  const navigation = useNavigation<PostScreenProps['navigation']>();
  const onReplyPress = useCallback(() => {
    navigation.navigate('NewReply', { commentId: id, postId });
  }, [id, navigation]);

  // persistentScrollbar only works on Android
  const BodyText = (
    <Text
      // onLayout={({ nativeEvent: { layout: { height } } }) => console.log({ titleHeight: height })}
      selectable={enableBodyTextSelection}
      selectionColor={colors.primary}
      style={styles.title}
    >
      {body}
    </Text>
  );
  const BodyView = compactView ? (
    <View style={styles.scrollViewContainer}>
      <ScrollView persistentScrollbar>{BodyText}</ScrollView>
    </View>
  ) : BodyText;

  return (
    <View
      onLayout={({ nativeEvent: { layout: { height } } }) => console.log({ height })}
      style={[
        styles.container,
        { marginStart },
        highlighted ? styles.highlightOn : styles.highlightOff,
      ]}
    >
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
      <View
        // onLayout={({ nativeEvent: { layout: { width } } }) => console.log({ width })}
        style={styles.innerContainer}
      >
        {BodyView}
        <Text
          // onLayout={({ nativeEvent: { layout: { height } } }) => console.log({ subtitleHeight: height })}
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
        {!hideTextButtonRow && (
          <View style={styles.textButtonRow}>
            {!disableReply && (
              <TextButton onPress={onReplyPress}>Reply</TextButton>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

CommentRow.defaultProps = {
  compactView: false,
  disableDepthIndent: false,
  enableBodyTextSelection: false,
  hideTextButtonRow: false,
  onCommentChanged: () => {},
};

export default memo(CommentRow);
