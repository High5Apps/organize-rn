import React from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: colors.fill,
      justifyContent: 'center',
      padding: spacing.s,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.extraLargeIcon,
      marginBottom: spacing.s,
    },
    prompt: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      textAlign: 'center',
    },
  });
  return { styles };
};

type Props = {
  iconName: string;
  prompt: string;
  style?: StyleProp<ViewStyle>;
};

export default function IconPrompt({ iconName, prompt, style }: Props) {
  const { styles } = useStyles();

  return (
    <View style={[styles.container, style]}>
      <Icon name={iconName} style={styles.icon} />
      <Text style={styles.prompt}>
        {prompt}
      </Text>
    </View>
  );
}

IconPrompt.defaultProps = {
  style: {},
};
