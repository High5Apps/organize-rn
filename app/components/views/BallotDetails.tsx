import React from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import { Ballot, formatDate } from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.labelSecondary,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

type Props = {
  ballot: Ballot;
  style?: StyleProp<ViewStyle>;
};

export default function BallotDetails({ ballot, style }: Props) {
  const { styles } = useStyles();
  return (
    <View style={style}>
      {ballot.maxCandidateIdsPerVote > 1 && (
        <Text style={styles.text}>
          {`Select up to ${ballot.maxCandidateIdsPerVote}`}
        </Text>
      )}
      {ballot.category === 'election' && (
        <Text style={styles.text}>
          {`Term is from ${
            formatDate(ballot.termStartsAt, 'dateOnlyShort')
          } to ${
            formatDate(ballot.termEndsAt, 'dateOnlyShort')
          }`}
        </Text>
      )}
      <Text style={styles.text}>Responses will be anonymous</Text>
      <Text style={styles.text}>Change your mind until voting ends</Text>
    </View>
  );
}

BallotDetails.defaultProps = {
  style: undefined,
};
