import { Platform } from 'react-native';

const palette = {
  purple: '#8944AB',
  green: '#66AB44',
  red: '#FF3B30',
  dark: '#09040B',
  light: '#F8F4FB',
};

const fontSize = Platform.select({
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
    foreground: palette.dark,
    primary: palette.purple,
    success: palette.green,
    danger: palette.red,
    failure: palette.red,
  },
  fontSize,
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
