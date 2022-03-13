import { Platform } from 'react-native';

const palette = {
  purple: '#8944AB',
  green: '#66AB44',
  red: '#FF3B30',
  dark: '#09040B',
  darkSecondary: '#8A8A8E',
  light: '#F8F4FB',
  lightSecondary: '#908E97',
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

const theme = {
  colors: {
    background: palette.light,
    backgroundSecondary: palette.lightSecondary,
    foreground: palette.dark,
    foregroundSecondary: palette.darkSecondary,
    primary: palette.purple,
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
export default theme;

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.dark,
    foreground: palette.light,
  },
};
