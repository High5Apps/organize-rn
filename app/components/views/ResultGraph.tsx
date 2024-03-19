import React, { useMemo } from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import { Result, getShortenedTitles } from '../../model';

const useStyles = (resultCount: number) => {
  const {
    colors, font, spacing, sizes,
  } = useTheme();

  // For 2 results, use a spacing of 8. For 4 use 6. For 6 use 4. For 9+ use 1.
  const rowMarginVertical = Math.max(1, 10 - resultCount);
  const textPaddingVertical = rowMarginVertical;

  const styles = StyleSheet.create({
    bar: {
      backgroundColor: colors.primary,
      flex: 1,
    },
    barLoser: {
      opacity: 0.5,
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
    row: {
      flexDirection: 'row',
      marginVertical: rowMarginVertical,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginHorizontal: spacing.s,
      paddingVertical: textPaddingVertical,
    },
    textColumn: {
      alignItems: 'flex-end',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    textInvisible: {
      marginHorizontal: 0,
    },
  });

  return { styles };
};

type Props = {
  results?: Result[];
  style?: StyleProp<ViewStyle>;
};

export default function ResultGraph({ results, style }: Props) {
  const resultCount = results?.length ?? 0;
  const { styles } = useStyles(resultCount);

  const shortenedTitles = useMemo(
    () => getShortenedTitles(results?.map((r) => r.candidate.title)),
    [results],
  );

  if (!results || resultCount === 0) { return null; }

  const maxVoteCount = results[0].voteCount;
  function getWidth(voteCount: number) {
    const percent = (maxVoteCount === 0) ? 0 : 100 * (voteCount / maxVoteCount);
    return `${percent}%`;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textColumn}>
        { results.map(({ candidate: { id } }, i) => (
          <Text key={id} style={[styles.text, styles.candidateTitle]}>
            {shortenedTitles[i]}
          </Text>
        ))}
      </View>
      <View style={styles.graphColumn}>
        { results.map(({ candidate: { id }, isWinner, voteCount }) => (
          <View key={id} style={[styles.row, { width: getWidth(voteCount) }]}>
            <View
              style={[
                styles.bar,
                !isWinner && styles.barLoser,
              ]}
            />
            <Text style={[styles.text, styles.textInvisible]}>
              {/* This makes the bar the same height as the padded text */}
              {/* eslint-disable-next-line
                react/jsx-curly-brace-presence, no-irregular-whitespace */}
              {'​'}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.textColumn}>
        { results.map(({ candidate: { id }, voteCount }) => (
          <View key={id} style={styles.row}>
            <Text style={styles.text}>{voteCount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

ResultGraph.defaultProps = {
  results: undefined,
  style: {},
};
