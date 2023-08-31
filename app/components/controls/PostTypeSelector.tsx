import React from 'react';
import { StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import useTheme from '../../Theme';
import { POST_TYPES, type PostType } from '../../model';

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
  selection?: PostType;
};

export default function PostTypeSelector({
  onSelectionChanged, selection,
}: Props) {
  const { styles } = useStyles();

  return (
    <SegmentedControl
      onChange={(event) => {
        const { nativeEvent: { selectedSegmentIndex } } = event;
        onSelectionChanged?.(POST_TYPES[selectedSegmentIndex]);
      }}
      onStartShouldSetResponder={() => true}
      selectedIndex={POST_TYPES.indexOf(selection ?? 'general')}
      style={styles.segmentedControl}
      values={capitalizedPostTypes}
    />
  );
}

PostTypeSelector.defaultProps = {
  onSelectionChanged: () => {},
  selection: 'general',
};
