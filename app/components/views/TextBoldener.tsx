/* eslint-disable react/no-array-index-key */
import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

type EmboldenOnDelimiterProps = {
  baseStyle: StyleProp<TextStyle>;
  boldStyle: StyleProp<TextStyle>;
  delimiter: string;
  text: string;
};

function emboldenOnDelimiter({
  baseStyle, boldStyle, delimiter, text,
}: EmboldenOnDelimiterProps) {
  return text.split(delimiter).map((string: string, index: number) => {
    const shouldBeBold = (index % 2) !== 0;
    return shouldBeBold
      ? <Text key={index} style={[baseStyle, boldStyle]}>{string}</Text>
      : <Text key={index} style={baseStyle}>{string}</Text>;
  });
}

type Props = {
  baseStyle: StyleProp<TextStyle>;
  boldStyle: StyleProp<TextStyle>;
  delimiter?: string;
  text: string;
};

const DEFAULT_DELIMITER = '**';

// For example, 'Hello, **world**' would display "world" as bold
export default function TextBoldener({
  baseStyle, boldStyle, delimiter: maybeDelimiter, text,
}: Props) {
  const delimiter = maybeDelimiter ?? DEFAULT_DELIMITER;
  const emboldenedText = emboldenOnDelimiter({
    baseStyle, boldStyle, delimiter, text,
  });
  return <Text style={baseStyle}>{emboldenedText}</Text>;
}

TextBoldener.defaultProps = {
  delimiter: DEFAULT_DELIMITER,
};
