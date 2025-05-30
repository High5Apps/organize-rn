import React, { memo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import useTheme from '../../../../Theme';
import { Post, VoteState } from '../../../../model';
import UpvoteControl from '../../UpvoteControl';
import {
  Byline, DisclosureIcon, HighlightedCurrentUserRowContainer, LockingScrollView,
} from '../../../views';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      // This attempts to align the top of the icons with the top of the title
      // text, itself, not with the top of the text container
      marginTop: 6,
    },
    highlightedCurrentUserRowContainer: {
      alignItems: 'flex-start',
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      paddingVertical: spacing.s,
    },
    scrollViewContainer: {
      maxHeight: 120,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
    titleDeleted: {
      color: colors.labelSecondary,
    },
  });

  return { colors, styles };
};

type Props = {
  compactView?: boolean;
  enableBodyTextSelection?: boolean;
  item: Post;
  onPress?: (item: Post) => void;
  onPostChanged?: (post: Post) => void;
};

function PostRow({
  compactView = false, enableBodyTextSelection = false, item, onPress,
  onPostChanged = () => {},
}: Props) {
  const {
    createdAt, deletedAt, id, myVote, pseudonym, score, userId,
  } = item;
  const { t } = useTranslation();
  const title = deletedAt ? t('placeholder.authorLeftOrg') : item.title;

  const { colors, styles } = useStyles();

  const TitleText = (
    <Text
      selectable={enableBodyTextSelection}
      selectionColor={colors.primary}
      style={[styles.title, deletedAt && styles.titleDeleted]}
    >
      {title}
    </Text>
  );

  const TitleView = compactView ? (
    <View style={styles.scrollViewContainer}>
      <LockingScrollView persistentScrollbar>{TitleText}</LockingScrollView>
    </View>
  ) : TitleText;

  return (
    <TouchableHighlight
      disabled={!onPress}
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <HighlightedCurrentUserRowContainer
        style={styles.highlightedCurrentUserRowContainer}
        userIds={[userId]}
      >
        <UpvoteControl
          disabled={!!deletedAt}
          errorItemFriendlyDifferentiator={title}
          onVoteChanged={(updatedVote: VoteState, updatedScore: number) => {
            onPostChanged?.({
              ...item,
              myVote: updatedVote,
              score: updatedScore,
            });
          }}
          postId={id}
          score={score}
          voteState={myVote}
        />
        <View style={styles.innerContainer}>
          {TitleView}
          <Byline author={pseudonym} createdAt={createdAt} />
        </View>
        {!!onPress && <DisclosureIcon style={styles.icon} />}
      </HighlightedCurrentUserRowContainer>
    </TouchableHighlight>
  );
}

export default memo(PostRow);
