import React, { useMemo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { Result } from '../../model';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      columnGap: spacing.m,
      flexDirection: 'row',
      padding: spacing.m,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
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
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      flex: 1,
    },
  });

  return { colors, styles };
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
}: IconNameProps) {
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

  const isAWinner = (multiSelectionWinnerRank !== undefined)
    || singleSelectionWinner;
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

type Props = IconNameProps & {
  item: Result;
};

export default function ResultRow({
  item, multiSelectionWinnerRank, singleSelectionLoser, singleSelectionTied,
  singleSelectionWinner,
}: Props) {
  const { candidate: { title } } = item;

  const { colors, styles } = useStyles();

  const IconComponent = useIcon({
    multiSelectionWinnerRank,
    singleSelectionLoser,
    singleSelectionTied,
    singleSelectionWinner,
  });

  return (
    <TouchableHighlight underlayColor={colors.label}>
      <View style={styles.container}>
        {IconComponent}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

ResultRow.defaultProps = {
  multiSelectionWinnerRank: undefined,
  singleSelectionLoser: undefined,
  singleSelectionTied: undefined,
  singleSelectionWinner: undefined,
};
