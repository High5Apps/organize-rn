import React from 'react';
import { StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import useTheme from '../../Theme';
import { POST_CATEGORIES, type PostCategory } from '../../model';

const capitalizedPostCategories = POST_CATEGORIES.map(
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
  disabled?: boolean;
  onSelectionChanged?: ((selection: PostCategory) => void);
  selection?: PostCategory;
};

export default function PostCategorySelector({
  disabled = false, onSelectionChanged = () => {}, selection = 'general',
}: Props) {
  const { styles } = useStyles();

  return (
    <SegmentedControl
      enabled={!disabled}
      onChange={(event) => {
        const { nativeEvent: { selectedSegmentIndex } } = event;
        onSelectionChanged?.(POST_CATEGORIES[selectedSegmentIndex]);
      }}
      onStartShouldSetResponder={() => true}
      selectedIndex={POST_CATEGORIES.indexOf(selection ?? 'general')}
      style={styles.segmentedControl}
      values={capitalizedPostCategories}
    />
  );
}
