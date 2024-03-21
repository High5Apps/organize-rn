import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussRecentScreenProps } from '../../navigation';

export default function DiscussRecentScreen({
  navigation, route,
}: DiscussRecentScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  return (
    <DiscussScreen <'Recent'>
      emptyListMessage={"All of your Org's **newly created discussions** will show up here.\n\nTap the button below to get started!"}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel="Discussion"
      sort="new"
    />
  );
}
