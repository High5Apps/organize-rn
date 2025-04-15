import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable } from 'react-native';

// Workaround for https://github.com/react-navigation/react-navigation/issues/11930
export default function TabBarButtonWithoutRipple({
  android_ripple: PressableAndroidRippleConfig, ...rest
}: BottomTabBarButtonProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Pressable {...rest} />;
}
