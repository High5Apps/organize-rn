import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import useTheme from '../../Theme';

const POST_TYPES = ['general', 'grievances', 'demands'] as const;
export type PostType = typeof POST_TYPES[number];

const capitalizedPostTypes = POST_TYPES.map(
  (pt) => pt.replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
);

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    segmentedControl: {
      margin: spacing.s,
    },
  });

  return { styles };
};

type Props = {
  onSelectionChanged?: ((selection: PostType) => void);
};

export default function PostTypeSelector({ onSelectionChanged }: Props) {
  const { styles } = useStyles();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <SegmentedControl
      onChange={(event) => {
        const { nativeEvent: { selectedSegmentIndex } } = event;
        setSelectedIndex(selectedSegmentIndex);
        onSelectionChanged?.(POST_TYPES[selectedSegmentIndex]);
      }}
      onStartShouldSetResponder={() => true}
      selectedIndex={selectedIndex}
      style={styles.segmentedControl}
      values={capitalizedPostTypes}
    />
  );
}

PostTypeSelector.defaultProps = {
  onSelectionChanged: () => {},
};
