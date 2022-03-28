import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

type Props = {
  style: StyleProp<TextStyle>;
  children: ReactNode;
};

export default function AutoscaledText({ style, children }: Props) {
  return (
    <Text
      adjustsFontSizeToFit
      numberOfLines={1}
      style={[style, { fontSize: 200, textAlign: 'center' }]}
    >
      { children }
    </Text>
  );
}
