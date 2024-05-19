import {
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import useTheme from '../Theme';

export default function useDefaultTopTabOptions() {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const screenPaddingStart = spacing.m;
  const screenOptions: MaterialTopTabNavigationOptions = {
    lazy: true,
    tabBarActiveTintColor: colors.primary,
    tabBarGap: spacing.s,
    tabBarInactiveTintColor: colors.labelSecondary,
    tabBarIndicatorContainerStyle: {
      marginLeft: screenPaddingStart,
    },
    tabBarItemStyle: {
      paddingHorizontal: 0,
      width: 'auto',
    },
    tabBarLabelStyle: {
      fontFamily: font.weights.semiBold,
    },
    tabBarScrollEnabled: true,
    tabBarStyle: {
      paddingLeft: screenPaddingStart,
      borderBottomWidth: sizes.separator,
      borderBottomColor: colors.separator,
    },
  };

  return screenOptions;
}