import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGeneralScreenProps } from '../navigation';

export default function DiscussGeneralScreen({
  navigation, route,
}: DiscussGeneralScreenProps) {
  const prependedPostIds = route.params?.prependedPostIds;

  return (
    <DiscussScreen <'General'>
      category="general"
      emptyListMessage={'You can **discuss anything** here.\n\nTap the button below to get started!'}
      prependedPostIds={prependedPostIds}
      navigation={navigation}
      primaryButtonLabel="Discussion"
      sort="hot"
    />
  );
}
