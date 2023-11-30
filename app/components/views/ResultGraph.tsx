import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RankedResult } from '../hooks';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, spacing, sizes,
  } = useTheme();

  const styles = StyleSheet.create({
    bar: {
      backgroundColor: colors.primary,
      flex: 1,
    },
    candidateTitle: {
      // This overrides styles.text
      marginStart: 0,
    },
    container: {
      flexDirection: 'row',
    },
    graphColumn: {
      backgroundColor: colors.fill,
      borderBottomWidth: sizes.border,
      borderColor: colors.primary,
      borderStartWidth: sizes.border,
      flex: 1,
      flexDirection: 'column',
    },
    labelColumn: {
      alignItems: 'flex-end',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    row: {
      flexDirection: 'row',
      marginVertical: spacing.s,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginHorizontal: spacing.xs,
      paddingVertical: spacing.s,
    },
  });

  return { styles };
};

type Props = {
  rankedResults?: RankedResult[];
};

export default function ResultGraph({ rankedResults }: Props) {
  const { styles } = useStyles();

  if (!rankedResults) { return null; }

  const maxVoteCount = rankedResults[0].voteCount;
  function getWidth(voteCount: number) {
    return `${100 * (voteCount / maxVoteCount)}%`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelColumn}>
        { rankedResults.map(({ candidate: { id, title } }) => (
          <Text key={id} style={[styles.text, styles.candidateTitle]}>
            {title}
          </Text>
        ))}
      </View>
      <View style={styles.graphColumn}>
        { rankedResults.map(({ candidate: { id }, voteCount }) => (
          <View key={id} style={[styles.row, { width: getWidth(voteCount) }]}>
            <View style={styles.bar} />
            <Text style={styles.text}>{voteCount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

ResultGraph.defaultProps = {
  rankedResults: undefined,
};
