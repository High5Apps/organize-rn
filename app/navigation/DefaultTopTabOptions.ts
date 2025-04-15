import {
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import useTheme from '../Theme';

export default function useDefaultTopTabOptions() {
  const { colors, sizes, spacing } = useTheme();

  const screenPaddingStart = spacing.m;
  const screenOptions: MaterialTopTabNavigationOptions = {
    lazy: true,
    tabBarActiveTintColor: colors.primary,

    // Workaround for https://github.com/react-navigation/react-navigation/issues/11930
    tabBarAndroidRipple: { radius: 0 },

    tabBarGap: spacing.s,
    tabBarInactiveTintColor: colors.labelSecondary,
    tabBarIndicatorContainerStyle: {
      marginLeft: screenPaddingStart,
    },
    tabBarItemStyle: {
      paddingHorizontal: 0,
      width: 'auto',
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
