import React from 'react';
import SegmentedControl
  from '@react-native-segmented-control/segmented-control';
import {
  POST_CATEGORIES, usePostCategoryTitles, type PostCategory,
} from '../../model';

type Props = {
  disabled?: boolean;
  onSelectionChanged?: ((selection: PostCategory) => void);
  selection?: PostCategory;
};

export default function PostCategorySelector({
  disabled = false, onSelectionChanged = () => {}, selection = 'general',
}: Props) {
  const postCategoryTitles = usePostCategoryTitles();
  const values = POST_CATEGORIES.map((c) => postCategoryTitles[c]);

  return (
    <SegmentedControl
      enabled={!disabled}
      onChange={(event) => {
        const { nativeEvent: { selectedSegmentIndex } } = event;
        onSelectionChanged?.(POST_CATEGORIES[selectedSegmentIndex]);
      }}
      onStartShouldSetResponder={() => true}
      selectedIndex={POST_CATEGORIES.indexOf(selection ?? 'general')}
      values={values}
    />
  );
}
