import { Platform, useColorScheme } from 'react-native';

const palette = {
  purpleDarker: '#AF52DE',
  purpleLighter: '#BF5AF2',
  green: '#66AB44',
  red: '#FF3B30',
  dark: '#09020D',
  darkSecondary: '#8A8A8E',
  darkTertiary: '#262626',
  light: '#F8F4FB',
  lightSecondary: '#908E97',
  lightTertiary: '#D9D9D9',
};

const weights = Platform.select({
  android: {
    regular: 'opensans_regular',
    medium: 'opensans_medium',
  },
  default: {
    regular: 'OpenSans-Regular',
    medium: 'OpenSans-Medium',
  },
});

const lightTheme = {
  colors: {
    background: palette.light,
    backgroundSecondary: palette.lightSecondary,
    backgroundTertiary: palette.lightTertiary,
    foreground: palette.dark,
    foregroundSecondary: palette.darkSecondary,
    foregroundTertiary: palette.darkTertiary,
    primary: palette.purpleDarker,
    success: palette.green,
    danger: palette.red,
    failure: palette.red,
  },
  font: {
    sizes: {
      paragraph: 17,
    },
    weights,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: palette.dark,
    backgroundSecondary: palette.darkSecondary,
    backgroundTertiary: palette.darkTertiary,
    foreground: palette.light,
    foregroundSecondary: palette.lightSecondary,
    foregroundTertiary: palette.lightTertiary,
    primary: palette.purpleLighter,
  },
};

const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return isDarkMode ? darkTheme : lightTheme;
};

export default useTheme;
