import React, { PropsWithChildren } from 'react';
import { SystemBars } from 'react-native-edge-to-edge';

export default function StatusBar({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {/* eslint-disable-next-line react/style-prop-object */}
      <SystemBars />
      {children}
    </>
  );
}
