import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  BallotPreview, getBallotTypeInfo, getMessageAge, getTimeRemaining,
  nominationsTimeRemainingFormatter, votingTimeRemainingFormatter,
} from '../../../../model';
import useTheme from '../../../../Theme';
import {
  DisclosureIcon, HighlightedCurrentUserRowContainer,
} from '../../../views';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
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

      marginStart: spacing.s,

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

function getSubtitle(votingEndsAt: Date, nominationsEndAt: Date | null) {
  const now = new Date();
  const inNomations = nominationsEndAt
    && nominationsEndAt?.getTime() > now.getTime();
  const active = votingEndsAt.getTime() > now.getTime();

  let subtitle;
  if (active) {
    const formatter = inNomations
      ? nominationsTimeRemainingFormatter
      : votingTimeRemainingFormatter;
    const time = inNomations ? nominationsEndAt : votingEndsAt;
    subtitle = getTimeRemaining(time, { formatter });
  } else {
    subtitle = getMessageAge(votingEndsAt);
  }
  return subtitle;
}

type Props = {
  item: BallotPreview;
  onPress?: (item: BallotPreview) => void;
};

export default function BallotPreviewRow({ item, onPress = () => {} }: Props) {
  const {
    category, question, userId, nominationsEndAt, votingEndsAt,
  } = item;
  const ballotTypeInfo = getBallotTypeInfo(category);
  const { t } = useTranslation();
  const title = (ballotTypeInfo.category === 'unknown')
    ? t('hint.unknownBallotType') : question;
  const subtitle = (ballotTypeInfo.category === 'unknown')
    ? t('hint.tapToUpdateApp') : getSubtitle(votingEndsAt, nominationsEndAt);

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <HighlightedCurrentUserRowContainer
        style={styles.container}
        userIds={[userId]}
      >
        <Icon name={ballotTypeInfo.iconName} style={styles.icon} />
        <View style={styles.innerContainer}>
          <Text style={[styles.text, styles.title]}>{title}</Text>
          <Text style={[styles.text, styles.subtitle]}>{subtitle}</Text>
        </View>
        <DisclosureIcon />
      </HighlightedCurrentUserRowContainer>
    </TouchableHighlight>
  );
}
