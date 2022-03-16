import { Platform, useColorScheme } from 'react-native';

const palette = {
  purpleDark2: '#1F082B',
  purpleDark0: '#AF52DE',
  purpleLight0: '#BF5AF2',
  purpleLight2: '#F8F4FB',
  green: '#66AB44',
  red: '#FF3B30',
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
  },
  default: {
    regular: 'OpenSans-Regular',
    medium: 'OpenSans-Medium',
  },
});

const lightTheme = {
  colors: {
    background: palette.purpleLight2,
    fill: palette.grayLight2,
    fillSecondary: palette.grayLight1,
    separator: palette.grayLight0,
    label: palette.purpleDark2,
    labelSecondary: palette.grayDark0,
    primary: palette.purpleDark0,
    success: palette.green,
    danger: palette.red,
    failure: palette.red,
  },
  font: {
    sizes: {
      largeTitle: 34,
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
    background: palette.purpleDark2,
    fill: palette.grayDark2,
    fillSecondary: palette.grayDark1,
    separator: palette.grayDark0,
    label: palette.purpleLight2,
    labelSecondary: palette.grayLight0,
    primary: palette.purpleLight0,
  },
};

const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return isDarkMode ? darkTheme : lightTheme;
};

export default useTheme;
