import React from 'react';
import { StyleSheet } from 'react-native';
import { LockingScrollView, OrgGraph, ScreenBackground } from '../components';

const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      aspectRatio: 1,
    },
  });

  return { styles };
};

export default function OrgScreen() {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingScrollView>
        <OrgGraph containerStyle={styles.container} />
      </LockingScrollView>
    </ScreenBackground>
  );
}
