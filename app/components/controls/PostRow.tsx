import React, { memo } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import useTheme from '../../Theme';
import { Post, VoteState, getMessageAge } from '../../model';
import UpvoteControl from './UpvoteControl';
import { DisclosureIcon, HighlightedRowContainer } from '../views';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      // This attempts to align the top of the icons with the top of the title
      // text, itself, not with the top of the text container
      marginTop: 6,
    },
    highlightedRowContainer: {
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
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  compactView?: boolean;
  disabled?: boolean;
  enableBodyTextSelection?: boolean;
  item: Post;
  onPress?: (item: Post) => void;
  onPostChanged?: (post: Post) => void;
};

function PostRow({
  compactView, disabled, enableBodyTextSelection, item, onPress, onPostChanged,
}: Props) {
  const {
    createdAt, id, myVote, pseudonym, score, title, userId,
  } = item;

  const { colors, styles } = useStyles();

  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  const TitleText = (
    <Text
      selectable={enableBodyTextSelection}
      selectionColor={colors.primary}
      style={styles.title}
    >
      {title}
    </Text>
  );

  const TitleView = compactView ? (
    <View style={styles.scrollViewContainer}>
      <ScrollView persistentScrollbar>{TitleText}</ScrollView>
    </View>
  ) : TitleText;

  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <HighlightedRowContainer
        style={styles.highlightedRowContainer}
        userIds={[userId]}
      >
        <UpvoteControl
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
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {!disabled && <DisclosureIcon style={styles.icon} />}
      </HighlightedRowContainer>
    </TouchableHighlight>
  );
}

PostRow.defaultProps = {
  compactView: false,
  disabled: false,
  enableBodyTextSelection: false,
  onPress: () => {},
  onPostChanged: () => {},
};

export default memo(PostRow);
