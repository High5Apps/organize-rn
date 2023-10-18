import useTheme from '../Theme';

export default function useDefaultStackNavigatorScreenOptions() {
  const { colors } = useTheme();
  return {
    navigationBarColor: colors.fill,
  };
}
