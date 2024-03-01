import { Platform, useColorScheme } from 'react-native';

const office: { [key: string]: string } = {
  founder: '#0054FF',
  president: '#00BFFF',
  vice_president: '#00FFFD',
  secretary: '#54FF00',
  treasurer: '#FEFF00',
  steward: '#FFAB00',
  trustee: '#FF00D0',
};

const palette = {
  purpleDark2: '#1F082B',
  purpleDark1: '#3B2B46',
  purpleDark0: '#AF52DE',
  purpleLight0: '#BF5AF2',
  purpleLight1: '#E3DFE6',
  purpleLight2: '#F8F4FB',
  green: '#66AB44',
  redLight: '#FF3B30',
  redDark: '#FF453A',
  grayDark2: '#000000',
  grayDark1: '#262626',
  grayDark0: '#8A8A8A',
  grayLight0: '#909090',
  grayLight1: '#D9D9D9',
  grayLight2: '#FFFFFF',
};

const weights = Platform.select({
  android: {
    regular: 'opensans_regular',
    medium: 'opensans_medium',
    semiBold: 'opensans_semibold',
    bold: 'opensans_bold',
  },
  default: {
    regular: 'OpenSans-Regular',
    medium: 'OpenSans-Medium',
    semiBold: 'OpenSans-SemiBold',
    bold: 'OpenSans-Bold',
  },
});

const lightTheme = {
  colors: {
    background: palette.purpleLight2,
    danger: palette.redLight,
    error: palette.redLight,
    fill: palette.grayLight2,
    fillSecondary: palette.grayLight1,
    fillTertiary: palette.purpleLight1,
    label: palette.purpleDark2,
    labelSecondary: palette.grayDark0,
    office,
    primary: palette.purpleDark0,
    separator: palette.grayLight0,
    success: palette.green,
  },
  font: {
    sizes: {
      largeTitle: 34,
      title1: 28,
      body: 17,
      subhead: 15,
    },
    weights,
  },
  shadows: {
    elevation1: {
      elevation: 1, // Android only
      shadowOffset: { // iOS only
        height: 1,
        width: 0,
      },
      shadowRadius: 1, // iOS only
    },
    elevation4: {
      elevation: 4, // Android only
      shadowOffset: { // iOS only
        height: 2,
        width: 0,
      },
      shadowOpacity: 0.5, // iOS only
      shadowRadius: 4, // iOS only
    },
  },
  sizes: {
    border: 1,
    buttonHeight: 50,
    icon: 24,
    mediumIcon: 32,
    minimumTappableLength: 44,
    largeIcon: 48,
    tabIcon: 28,
    extraLargeIcon: 96,
    separator: 0.5,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 32,
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: palette.purpleDark2,
    danger: palette.redDark,
    error: palette.redDark,
    fill: palette.grayDark2,
    fillSecondary: palette.grayDark1,
    fillTertiary: palette.purpleDark1,
    label: palette.purpleLight2,
    labelSecondary: palette.grayLight0,
    office,
    primary: palette.purpleLight0,
    separator: palette.grayDark0,
  },
};

const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  return {
    ...theme,
    isDarkMode,
  };
};

export default useTheme;

export type Theme = ReturnType<typeof useTheme>;
export type ThemeColors = Theme['colors'];

export const useNavigationTheme = () => {
  const { colors, isDarkMode } = useTheme();
  return {
    colors: {
      background: colors.background,
      border: colors.separator,
      card: colors.fill,
      notification: colors.error,
      primary: colors.primary,
      text: colors.label,
    },
    dark: isDarkMode,
  };
};
