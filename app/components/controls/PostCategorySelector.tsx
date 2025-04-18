import React from 'react';
import SegmentedControl
  from '@react-native-segmented-control/segmented-control';
import { POST_CATEGORIES, type PostCategory } from '../../model';

const capitalizedPostCategories = POST_CATEGORIES.map(
  (pt) => pt.replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
);

type Props = {
  disabled?: boolean;
  onSelectionChanged?: ((selection: PostCategory) => void);
  selection?: PostCategory;
};

export default function PostCategorySelector({
  disabled = false, onSelectionChanged = () => {}, selection = 'general',
}: Props) {
  return (
    <SegmentedControl
      enabled={!disabled}
      onChange={(event) => {
        const { nativeEvent: { selectedSegmentIndex } } = event;
        onSelectionChanged?.(POST_CATEGORIES[selectedSegmentIndex]);
      }}
      onStartShouldSetResponder={() => true}
      selectedIndex={POST_CATEGORIES.indexOf(selection ?? 'general')}
      values={capitalizedPostCategories}
    />
  );
}
