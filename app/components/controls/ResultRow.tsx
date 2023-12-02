import React from 'react';
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

function getIcon({ tiedWinner, winner }: IconNameProps) {
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

  return { iconName, iconStyle };
}

type Props = IconNameProps & {
  item: RankedResult;
};

export default function ResultRow({
  item, tiedWinner, winner,
}: Props) {
  const { candidate: { title } } = item;

  const { iconName, iconStyle } = getIcon({ tiedWinner, winner });

  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight underlayColor={colors.label}>
      <View style={styles.container}>
        <Icon name={iconName} style={[styles.icon, iconStyle]} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

ResultRow.defaultProps = {
  tiedWinner: false,
  winner: false,
};
