import React, { PropsWithChildren } from 'react';
import { StatusBar as RNStatusBar, useColorScheme } from 'react-native';
import useTheme from '../../Theme';

export default function StatusBar({ children }: PropsWithChildren<{}>) {
  const { colors } = useTheme();
  const backgroundColor = colors.fill; // backgroundColor only affects Android

  const isDarkMode = useColorScheme() === 'dark';
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      <RNStatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      {children}
    </>
  );
}
