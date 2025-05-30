import React from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import { Ballot, formatDate } from '../../model';
import useTheme from '../../Theme';
import { useTranslation } from '../../i18n';

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
  ballot?: Ballot;
  style?: StyleProp<ViewStyle>;
};

export default function BallotDetails({ ballot, style }: Props) {
  const { styles } = useStyles();
  const { t } = useTranslation();
  if (!ballot) { return null; }
  const { category, maxCandidateIdsPerVote, votingEndsAt } = ballot;
  const votingEnded = votingEndsAt.getTime() <= new Date().getTime();
  const termDurationMessage = (category === 'election') && (
    t('time.hint.duration.term', {
      end: formatDate(ballot.termEndsAt, 'dateOnlyShort'),
      start: formatDate(ballot.termStartsAt, 'dateOnlyShort'),
    })
  );
  const multipleSelectionsMessage = votingEnded
    ? t('hint.winnersMultiple', { maxCandidateIdsPerVote })
    : t('hint.voteMultiple', { maxCandidateIdsPerVote });

  return (
    <View style={style}>
      {maxCandidateIdsPerVote > 1 && (
        <Text style={styles.text}>{multipleSelectionsMessage}</Text>
      )}
      {termDurationMessage && (
        <Text style={styles.text}>{termDurationMessage}</Text>
      )}
      {!votingEnded && (
        <>
          <Text style={styles.text}>{t('hint.voteAnnonymous')}</Text>
          <Text style={styles.text}>{t('hint.voteModifiable')}</Text>
        </>
      )}
    </View>
  );
}
