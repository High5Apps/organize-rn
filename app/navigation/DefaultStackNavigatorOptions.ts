import { Platform } from 'react-native';
import { DefaultTheme } from '@react-navigation/native';

export default function useDefaultStackNavigatorOptions() {
  return {
    ...Platform.select({
      ios: {
        headerBackTitleStyle: DefaultTheme.fonts.regular,
        headerTitleStyle: DefaultTheme.fonts.bold,
      },
    }),
  };
}
