import React, { PropsWithChildren } from 'react';
import { StatusBar as RNStatusBar } from 'react-native';
import useTheme from '../../Theme';

export default function StatusBar({ children }: PropsWithChildren<{}>) {
  const { colors, isDarkMode } = useTheme();
  const backgroundColor = colors.fill; // backgroundColor only affects Android

  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      <RNStatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      {children}
    </>
  );
}
