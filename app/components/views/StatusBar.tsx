import React, { PropsWithChildren } from 'react';
import { ColorValue, StatusBar as RNStatusBar } from 'react-native';
import useTheme from '../../Theme';

type Props = {
  backgroundColor?: ColorValue;
};

export default function StatusBar({
  backgroundColor: maybeBackgroundColor, children,
}: PropsWithChildren<Props>) {
  const { colors, isDarkMode } = useTheme();

  // backgroundColor only affects Android
  const backgroundColor = maybeBackgroundColor ?? colors.fill;

  const barStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <>
      <RNStatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      {children}
    </>
  );
}
