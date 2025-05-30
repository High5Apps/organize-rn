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
  orangeLight: '#FF9500',
  orangeDark: '#FF9F0A',
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
    warning: palette.orangeLight,
  },
  font: {
    sizes: {
      largeTitle: 34,
      title1: 28,
      body: 17,
    },
    weights,
  },
  opacity: {
    blocked: 0.25,
    disabled: 0.5,
    hidden: 0,
    visible: 1,
  },
  shadows: {
    elevation1: {
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
    },
    elevation4: {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
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
    warning: palette.orangeDark,
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
  const { colors, font, isDarkMode } = useTheme();
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
    fonts: {
      regular: {
        fontFamily: font.weights.regular,
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: font.weights.medium,
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: font.weights.semiBold,
        fontWeight: '600' as const,
      },
      heavy: {
        fontFamily: font.weights.bold,
        fontWeight: '700' as const,
      },
    },
  };
};
