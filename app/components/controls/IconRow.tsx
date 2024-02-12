import React, { useMemo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import { DisclosureIcon } from '../views';
import TextButton from './TextButton';

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
    textButton: {
      fontSize: font.sizes.body,
    },
  });

  return { colors, styles };
};

type Props = {
  iconName: string;
  onPress?: () => void;
  textButtonLabel?: string;
  title: string;
};

export default function IconRow({
  iconName, onPress, textButtonLabel, title,
}: Props) {
  const { colors, styles } = useStyles();

  const Accessory = useMemo(() => {
    if (onPress === undefined) { return null; }

    if (textButtonLabel === undefined) { return <DisclosureIcon />; }

    return (
      <TextButton onPress={onPress} style={styles.textButton}>
        {textButtonLabel}
      </TextButton>
    );
  }, [onPress, textButtonLabel, styles]);

  return (
    <TouchableHighlight
      onPress={textButtonLabel ? undefined : onPress}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <Icon name={iconName} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
        {Accessory}
      </View>
    </TouchableHighlight>
  );
}

IconRow.defaultProps = {
  onPress: undefined,
  textButtonLabel: undefined,
};
