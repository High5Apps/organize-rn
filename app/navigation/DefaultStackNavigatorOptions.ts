import useTheme from '../Theme';

export default function useDefaultStackNavigatorOptions() {
  const { colors } = useTheme();
  return {
    navigationBarColor: colors.fill,
  };
}
