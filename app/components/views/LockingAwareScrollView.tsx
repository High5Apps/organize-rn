import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

const useStyles = () => {
  const styles = StyleSheet.create({
    scrollView: {
      flexGrow: 1,
    },
  });

  return { styles };
};

type Props = {
  onScrollEnabledChanged?: (scrollEnabled: boolean) => void;
  style?: ViewStyle;
};

export default function LockingAwareScrollView({
  children, onScrollEnabledChanged = () => {}, style = {},
}: PropsWithChildren<Props>) {
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    setScrollEnabled(contentHeight > layoutHeight);
  }, [contentHeight, layoutHeight]);

  useEffect(() => {
    onScrollEnabledChanged?.(scrollEnabled);
  }, [scrollEnabled]);

  const { styles } = useStyles();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      onContentSizeChange={(_, h) => setContentHeight(h)}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setLayoutHeight(height);
      }}
      contentContainerStyle={[
        styles.scrollView,
        style,
      ]}
      scrollEnabled={scrollEnabled}
    >
      {children}
    </ScrollView>
  );
}
