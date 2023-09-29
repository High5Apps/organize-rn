import React, { memo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import {
  Post, VoteState, getMessageAge, useUserContext,
} from '../../model';
import UpvoteControl from './UpvoteControl';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const containerPaddingStart = spacing.s;

  const styles = StyleSheet.create({
    icon: {
      alignSelf: 'center',
      color: colors.separator,
      fontSize: sizes.mediumIcon,
    },
    container: {
      backgroundColor: colors.fill,
      flexDirection: 'row',
      paddingEnd: spacing.s,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      paddingVertical: spacing.s,
    },
    highlightOff: {
      paddingStart: containerPaddingStart,
    },
    highlightOn: {
      borderColor: colors.primary,
      borderStartWidth: containerPaddingStart,
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
  disabled?: boolean;
  enableBodyTextSelection?: boolean;
  item: Post;
  onPress?: (item: Post) => void;
  onPostChanged?: (post: Post) => void;
};

function PostRow({
  disabled, enableBodyTextSelection, item, onPress, onPostChanged,
}: Props) {
  const {
    createdAt, id, myVote, pseudonym, score, title, userId,
  } = item;

  const { colors, styles } = useStyles();

  const timeAgo = getMessageAge(createdAt);
  const subtitle = `By ${pseudonym} ${timeAgo}`;

  const { currentUser } = useUserContext();
  const highlighted = userId === currentUser?.id;

  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View
        style={[
          styles.container,
          highlighted ? styles.highlightOn : styles.highlightOff,
        ]}
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
          <Text
            selectable={enableBodyTextSelection}
            selectionColor={colors.primary}
            style={styles.title}
          >
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {!disabled && <Icon name="chevron-right" style={styles.icon} />}
      </View>
    </TouchableHighlight>
  );
}

PostRow.defaultProps = {
  disabled: false,
  enableBodyTextSelection: false,
  onPress: () => {},
  onPostChanged: () => {},
};

export default memo(PostRow);
