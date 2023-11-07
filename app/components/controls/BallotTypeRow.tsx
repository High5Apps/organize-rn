import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BallotType } from '../../model';
import useTheme from '../../Theme';
import { DisclosureIcon } from '../views';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      flexDirection: 'row',
      padding: spacing.m,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.icon,
    },
    text: {
      color: colors.label,
      flex: 1,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      paddingHorizontal: spacing.m,
    },
  });

  return { colors, styles };
};

type Props = {
  ballotType: BallotType
};

export default function BallotTypeRow({
  ballotType: { iconName, name },
}: Props) {
  const { colors, styles } = useStyles();

  return (
    <TouchableHighlight
      onPress={() => console.log('press')}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <Icon name={iconName} style={styles.icon} />
        <Text style={styles.text}>{name}</Text>
        <DisclosureIcon />
      </View>
    </TouchableHighlight>
  );
}
