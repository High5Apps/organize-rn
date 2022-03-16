import React, { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import useTheme from './Theme';

const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    background: {
      backgroundColor: colors.background,
      flex: 1,
    },
  });

  return { styles };
};

export default function NewOrgScreen({ children }: PropsWithChildren<{}>) {
  const { styles } = useStyles();
  return (
    <SafeAreaView style={styles.background}>
      {children}
    </SafeAreaView>
  );
}
