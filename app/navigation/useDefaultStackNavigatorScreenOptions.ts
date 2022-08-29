import useTheme from '../Theme';

export default function useDefaultStackNavigatorScreenOptions() {
  const { colors } = useTheme();
  return {
    headerStyle: {
      backgroundColor: colors.fill,
    },
    headerTintColor: colors.primary,
    headerTitleStyle: { color: colors.label },
  };
}
