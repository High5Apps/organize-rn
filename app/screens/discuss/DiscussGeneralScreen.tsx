import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGeneralScreenProps } from '../../navigation';

export default function DiscussGeneralScreen({
  navigation, route,
}: DiscussGeneralScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  return (
    <DiscussScreen <'General'>
      category="general"
      emptyListMessage={'You can **discuss anything** here.\n\nTap the button below to get started!'}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel="Discussion"
      screenName={route.name}
      sort="hot"
    />
  );
}
