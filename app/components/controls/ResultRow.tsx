import React, { useMemo } from 'react';
import {
  StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { Result } from '../../model';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const firstRowColumnGap = spacing.m;
  const iconFontSize = sizes.mediumIcon;
  const subtitleMarginStart = firstRowColumnGap + iconFontSize;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      padding: spacing.m,
    },
    firstRow: {
      alignItems: 'center',
      columnGap: firstRowColumnGap,
      flexDirection: 'row',
    },
    icon: {
      color: colors.primary,
      fontSize: iconFontSize,
    },
    iconDim: {
      opacity: 0.5,
    },
    rank: {
      color: colors.primary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.semiBold,
    },
    rankContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      ...StyleSheet.absoluteFillObject,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
      marginStart: subtitleMarginStart,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      flex: 1,
    },
  });

  return { styles };
};

type IconNameProps = {
  multiSelectionWinnerRank?: number;
  singleSelectionLoser?: boolean;
  singleSelectionTied?: boolean;
  singleSelectionWinner?: boolean;
};

function useIcon({
  multiSelectionWinnerRank, singleSelectionLoser, singleSelectionTied,
  singleSelectionWinner,
}: IconNameProps, isAWinner: boolean) {
  const { styles } = useStyles();

  let iconName: string;
  let iconStyle: ViewStyle = {};

  if (singleSelectionWinner) {
    iconName = 'check-circle';
  } else if (singleSelectionTied) {
    iconName = 'pause-circle-filled';
    iconStyle = { transform: [{ rotate: '90deg' }] };
  } else if (singleSelectionLoser) {
    iconName = 'radio-button-unchecked';
  } else {
    iconName = 'check-box-outline-blank';
  }

  if (!isAWinner) {
    iconStyle = { ...iconStyle, ...styles.iconDim };
  }

  return useMemo(() => (
    <View>
      <Icon name={iconName} style={[styles.icon, iconStyle]} />
      {(multiSelectionWinnerRank !== undefined) && (
        <View style={styles.rankContainer}>
          <Text allowFontScaling={false} style={styles.rank}>
            {1 + multiSelectionWinnerRank}
          </Text>
        </View>
      )}
    </View>
  ), [iconName, iconStyle, multiSelectionWinnerRank, styles]);
}

function getOfficeAcceptance(termStartsAt: Date, acceptedOffice?: boolean) {
  if (acceptedOffice) {
    return 'Accepted office';
  }

  if (acceptedOffice === false) {
    return 'Declined office';
  }

  if (new Date().getTime() < termStartsAt?.getTime()) {
    return "Hasn't accepted office yet";
  }

  return 'Missed deadline to accept office';
}

type Props = IconNameProps & {
  item: Result;
  termStartsAt?: Date;
};

export default function ResultRow({
  item, multiSelectionWinnerRank, singleSelectionLoser, singleSelectionTied,
  singleSelectionWinner, termStartsAt,
}: Props) {
  const { acceptedOffice, candidate: { title } } = item;
  const isAWinner = (multiSelectionWinnerRank !== undefined)
    || !!singleSelectionWinner;

  const { styles } = useStyles();

  const IconComponent = useIcon({
    multiSelectionWinnerRank,
    singleSelectionLoser,
    singleSelectionTied,
    singleSelectionWinner,
  }, isAWinner);

  return (
    <View style={styles.container}>
      <View style={styles.firstRow}>
        {IconComponent}
        <Text style={styles.text}>{title}</Text>
      </View>
      {termStartsAt && isAWinner && (
        <Text style={styles.subtitle}>
          {getOfficeAcceptance(termStartsAt, acceptedOffice)}
        </Text>
      )}
    </View>
  );
}

ResultRow.defaultProps = {
  multiSelectionWinnerRank: undefined,
  singleSelectionLoser: undefined,
  singleSelectionTied: undefined,
  singleSelectionWinner: undefined,
  termStartsAt: undefined,
};
