import { Platform } from 'react-native';
import { DefaultTheme } from '@react-navigation/native';
import useTheme from '../Theme';

export default function useDefaultStackNavigatorOptions() {
  const { colors } = useTheme();
  return {
    ...Platform.select({
      ios: {
        headerBackTitleStyle: DefaultTheme.fonts.regular,
        headerTitleStyle: DefaultTheme.fonts.bold,
      },
    }),
    navigationBarColor: colors.fill,
  };
}
