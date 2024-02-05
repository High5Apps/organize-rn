import React, { useMemo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { RankedResult } from '../hooks';

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
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { colors, styles };
};

type IconNameProps = {
  tiedWinner?: boolean;
  winner?: boolean;
};

function useIcon({ tiedWinner, winner }: IconNameProps) {
  const { styles } = useStyles();

  let iconName: string;
  let iconStyle: ViewStyle = {};

  if (winner) {
    iconName = 'check-circle';
  } else if (tiedWinner) {
    iconName = 'pause-circle-filled';
    iconStyle = { transform: [{ rotate: '90deg' }] };
  } else {
    iconName = 'radio-button-unchecked';
  }

  return useMemo(() => (
    <Icon name={iconName} style={[styles.icon, iconStyle]} />
  ), [iconName, iconStyle, styles]);
}

type Props = IconNameProps & {
  item: RankedResult;
};

export default function ResultRow({
  item, tiedWinner, winner,
}: Props) {
  const { candidate: { title } } = item;

  const { colors, styles } = useStyles();

  const IconComponent = useIcon({ tiedWinner, winner });

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
  tiedWinner: false,
  winner: false,
};
