import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeAreaPadding({ children }: PropsWithChildren<{}>) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,

        // Paddings to handle safe area
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingTop: insets.top,
      }}
    >
      {children}
    </View>
  );
}
