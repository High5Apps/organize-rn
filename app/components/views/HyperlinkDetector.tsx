import React, { JSXElementConstructor, ReactElement, useCallback } from 'react';
import { Linking, StyleSheet } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    link: {
      color: colors.primary,
    },
  });

  return { styles };
};

type Props = {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
};

export default function HyperlinkDetector({ children }: Props) {
  const { styles } = useStyles();

  const onPress = useCallback((url: string) => Linking.openURL(url), []);

  return (
    <Hyperlink onPress={onPress} linkStyle={styles.link}>
      {children}
    </Hyperlink>
  );
}
