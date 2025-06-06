import React, { memo, useCallback } from 'react';
import {
  StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../../Theme';
import { Comment, MAX_COMMENT_DEPTH, useCurrentUser } from '../../../../model';
import UpvoteControl from '../../UpvoteControl';
import { FlagTextButton, TextButton } from '../../buttons';
import type { PostScreenProps } from '../../../../navigation';
import {
  Byline, HighlightedRowContainer, HyperlinkDetector, LockingScrollView,
} from '../../../views';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const { width: screenWidth } = useWindowDimensions();

  // The deepest comment width should be at least 2/3 of the screen width
  const nestedMarginStart = (screenWidth / 3) / (MAX_COMMENT_DEPTH - 1);

  const styles = StyleSheet.create({
    highlightedCurrentUserRowContainer: {
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
    titleDisabled: {
      color: colors.labelSecondary,
    },
  });

  return {
    colors, nestedMarginStart, spacing, styles,
  };
};

type Props = {
  compactView?: boolean;
  disableDepthIndent?: boolean;
  enableBodyTextSelection?: boolean;
  hideTextButtonRow?: boolean;
  highlightObjectionableContent?: boolean;
  item: Comment;
  onCommentChanged?: (comment: Comment) => void;
  showBlockedContent?: boolean;
};

function CommentRow({
  compactView = false, disableDepthIndent = false,
  enableBodyTextSelection = false, hideTextButtonRow = false,
  highlightObjectionableContent = false, item, onCommentChanged = () => {},
  showBlockedContent = false,
}: Props) {
  const {
    blockedAt, createdAt, deletedAt, depth, id, myVote, postId, pseudonym,
    score, userId,
  } = item;
  const shouldShowAsBlocked = !!blockedAt && !showBlockedContent;
  const shouldShowAsDisabled = !!deletedAt || shouldShowAsBlocked;
  const { t } = useTranslation();
  let body: string;
  if (deletedAt) {
    body = t('placeholder.authorLeftOrg');
  } else if (shouldShowAsBlocked) {
    body = t('placeholder.contentBlocked');
  } else {
    body = item.body;
  }

  // MAX_COMMENT_DEPTH - 1 because depth is 0-indexed
  const hideReplyButton = depth >= (MAX_COMMENT_DEPTH - 1);

  const {
    colors, nestedMarginStart, spacing, styles,
  } = useStyles();
  const marginStart = disableDepthIndent ? 0 : depth * nestedMarginStart;

  const navigation = useNavigation<PostScreenProps['navigation']>();
  const onReplyPress = useCallback(() => {
    navigation.navigate('NewReply', { commentId: id, postId });
  }, [id, navigation]);

  const { currentUser } = useCurrentUser();
  const highlightCurrentUser = !!currentUser && userId === currentUser?.id;

  const BodyText = (
    <HyperlinkDetector>
      <Text
        selectable={enableBodyTextSelection}
        selectionColor={colors.primary}
        style={[styles.title, shouldShowAsDisabled && styles.titleDisabled]}
      >
        {body}
      </Text>
    </HyperlinkDetector>
  );
  const BodyView = compactView ? (
    <View style={styles.scrollViewContainer}>
      {/* persistentScrollbar only works on Android */}
      <LockingScrollView persistentScrollbar>{BodyText}</LockingScrollView>
    </View>
  ) : BodyText;

  return (
    <HighlightedRowContainer
      color={highlightObjectionableContent ? colors.error : colors.primary}
      highlighted={highlightObjectionableContent || highlightCurrentUser}
      style={StyleSheet.flatten([
        styles.highlightedCurrentUserRowContainer,
        { marginStart },
      ])}
      width={spacing.s}
    >
      <UpvoteControl
        commentId={id}
        disabled={shouldShowAsDisabled}
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
        <Byline author={pseudonym} createdAt={createdAt} />
        {!hideTextButtonRow && (
          <View style={styles.textButtonRow}>
            {!hideReplyButton && (
              <TextButton
                disabled={shouldShowAsDisabled}
                onPress={onReplyPress}
              >
                {t('action.reply')}
              </TextButton>
            )}
            <FlagTextButton commentId={id} disabled={shouldShowAsDisabled} />
          </View>
        )}
      </View>
    </HighlightedRowContainer>
  );
}

export default memo(CommentRow);
