import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Ballot, ballotTypeMap, getMessageAge, getTimeRemaining,
  votingTimeRemainingFormatter,
} from '../../model';
import useTheme from '../../Theme';
import { DisclosureIcon, HighlightedRowContainer } from '../views';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      columnGap: spacing.m,
      paddingVertical: spacing.s,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.icon,

      // This attempts to align the top of the icons with the top of the
      // question text, itself, not with the top of the text container
      marginTop: 7,

      paddingStart: spacing.s,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',

      // This attempts to align the top of the icons with the top of the
      // question text, itself, not with the top of the text container
      marginTop: 2,
    },
    subtitle: {
      color: colors.labelSecondary,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    title: {
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  item: Ballot;
  onPress?: (item: Ballot) => void;
};

export default function BallotRow({ item, onPress }: Props) {
  const {
    category, question, userId, votingEndsAt,
  } = item;
  const now = new Date();
  const active = votingEndsAt.getTime() > now.getTime();
  const subtitle = active
    ? getTimeRemaining(votingEndsAt, { formatter: votingTimeRemainingFormatter })
    : getMessageAge(votingEndsAt);

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <HighlightedRowContainer style={styles.container} userId={userId}>
        <Icon name={ballotTypeMap[category].iconName} style={styles.icon} />
        <View style={styles.innerContainer}>
          <Text style={[styles.text, styles.title]}>{question}</Text>
          <Text style={[styles.text, styles.subtitle]}>{subtitle}</Text>
        </View>
        <DisclosureIcon />
      </HighlightedRowContainer>
    </TouchableHighlight>
  );
}

BallotRow.defaultProps = {
  onPress: () => {},
};
