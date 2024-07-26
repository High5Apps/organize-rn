import React, { memo, useCallback } from 'react';
import {
  ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../Theme';
import {
  BLOCKED_COMMENT_BODY, Comment, MAX_COMMENT_DEPTH, getMessageAge,
} from '../../model';
import UpvoteControl from './UpvoteControl';
import TextButton from './TextButton';
import type { PostScreenProps } from '../../navigation';
import { HighlightedRowContainer, HyperlinkDetector } from '../views';
import FlagTextButton from './FlagTextButton';

const useStyles = () => {
  const {
    colors, font, opacity, spacing,
  } = useTheme();

  const { width: screenWidth } = useWindowDimensions();

  // The deepest comment width should be at least 2/3 of the screen width
  const nestedMarginStart = (screenWidth / 3) / (MAX_COMMENT_DEPTH - 1);

  const styles = StyleSheet.create({
    highlightedRowContainer: {
      paddingEnd: spacing.m,
      paddingVertical: spacing.xs,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      paddingVertical: spacing.s,
    },
    scrollViewContainer: {
      maxHeight: 120,
    },
    subtitle: {
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
    titleBlocked: {
      opacity: opacity.disabled,
    },
  });

  return { colors, nestedMarginStart, styles };
};

type Props = {
  compactView?: boolean;
  disableDepthIndent?: boolean;
  enableBodyTextSelection?: boolean;
  hideTextButtonRow?: boolean;
  item: Comment;
  onCommentChanged?: (comment: Comment) => void;
  showBlockedContent?: boolean;
};

function CommentRow({
  compactView, disableDepthIndent, enableBodyTextSelection, hideTextButtonRow,
  item, onCommentChanged, showBlockedContent,
}: Props) {
  const {
    blocked, createdAt, depth, id, myVote, postId, pseudonym, score, userId,
  } = item;
  const shouldShowAsBlocked = blocked && !showBlockedContent;
  const body = shouldShowAsBlocked ? BLOCKED_COMMENT_BODY : item.body;

  // MAX_COMMENT_DEPTH - 1 because depth is 0-indexed
  const hideReplyButton = depth >= (MAX_COMMENT_DEPTH - 1);

  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  const { colors, nestedMarginStart, styles } = useStyles();
  const marginStart = disableDepthIndent ? 0 : depth * nestedMarginStart;

  const navigation = useNavigation<PostScreenProps['navigation']>();
  const onReplyPress = useCallback(() => {
    navigation.navigate('NewReply', { commentId: id, postId });
  }, [id, navigation]);

  const BodyText = (
    <HyperlinkDetector>
      <Text
        selectable={enableBodyTextSelection}
        selectionColor={colors.primary}
        style={[styles.title, shouldShowAsBlocked && styles.titleBlocked]}
      >
        {body}
      </Text>
    </HyperlinkDetector>
  );
  const BodyView = compactView ? (
    <View style={styles.scrollViewContainer}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        persistentScrollbar // persistentScrollbar only works on Android
      >
        {BodyText}
      </ScrollView>
    </View>
  ) : BodyText;

  return (
    <HighlightedRowContainer
      style={StyleSheet.flatten([
        styles.highlightedRowContainer,
        { marginStart },
      ])}
      userIds={[userId]}
    >
      <UpvoteControl
        commentId={id}
        disabled={shouldShowAsBlocked}
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
        {BodyView}
        <Text style={styles.subtitle}>{subtitle}</Text>
        {!hideTextButtonRow && (
          <View style={styles.textButtonRow}>
            {!hideReplyButton && (
              <TextButton disabled={shouldShowAsBlocked} onPress={onReplyPress}>
                Reply
              </TextButton>
            )}
            <FlagTextButton commentId={id} disabled={shouldShowAsBlocked} />
          </View>
        )}
      </View>
    </HighlightedRowContainer>
  );
}

CommentRow.defaultProps = {
  compactView: false,
  disableDepthIndent: false,
  enableBodyTextSelection: false,
  hideTextButtonRow: false,
  onCommentChanged: () => {},
  showBlockedContent: false,
};

export default memo(CommentRow);
