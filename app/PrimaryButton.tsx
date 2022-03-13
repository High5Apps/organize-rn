import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Theme from './Theme';

const styles = StyleSheet.create({
  icon: {
    color: Theme.colors.background,
    fontSize: 24,
    marginEnd: Theme.spacing.s,
  },
  pressable: {
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: 25,
    elevation: 4, // Android only
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowOffset: { // iOS only
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.5, // iOS only
    shadowRadius: 4, // iOS only
  },
  pressed: {
    elevation: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowRadius: 1,
  },
  text: {
    color: Theme.colors.background,
    fontSize: Theme.font.sizes.paragraph,
    fontFamily: Theme.font.weights.regular,
  },
});

type Props = {
  iconName: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  label: string;
};

const PrimaryButton = (props: Props) => {
  const {
    iconName, onPress, label, style,
  } = props;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon name={iconName} style={styles.icon} />
      <Text style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
};

export default PrimaryButton;

PrimaryButton.defaultProps = {
  onPress: () => {},
  style: {},
};
