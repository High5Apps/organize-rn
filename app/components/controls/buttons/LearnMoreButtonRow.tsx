import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../Theme';

const useStyles = () => {
  const {
    colors, font, spacing, sizes,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start',
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
    },
    innerContainer: {
      alignItems: 'center',
      columnGap: spacing.m,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: spacing.m,
    },
    text: {
      color: colors.primary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
    },
  });

  return { styles };
};

type Props = {
  onPress: () => void;
};

export default function LearnMoreButtonRow({ onPress }: Props) {
  const { styles } = useStyles();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <Icon name="help-outline" style={styles.icon} />
        <Text style={styles.text}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );
}
