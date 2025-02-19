import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

export default function LockingScrollView(props: ScrollViewProps) {
  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}
