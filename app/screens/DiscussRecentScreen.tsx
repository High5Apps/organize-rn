import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussRecentScreenProps } from '../navigation';

export default function DiscussRecentScreen({
  navigation, route,
}: DiscussRecentScreenProps) {
  const insertedPostIds = route.params?.insertedPostIds;

  return (
    <DiscussScreen <'Recent'>
      emptyListMessage={"All of your Org's **newly created discussions** will show up here.\n\nTap the button below to get started!"}
      insertedPostIds={insertedPostIds}
      navigation={navigation}
      primaryButtonLabel="Discussion"
      sort="new"
    />
  );
}
