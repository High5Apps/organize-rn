import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussDemandsScreenProps } from '../../navigation';

export default function DiscussDemandsScreen({
  navigation, route,
}: DiscussDemandsScreenProps) {
  const prependedPostIds = route.params?.prependedPostIds;

  return (
    <DiscussScreen <'Demands'>
      category="demands"
      emptyListMessage={"Demands let you voice how specific things should **change for the better**.\n\nOver time, Org members' upvotes and downvotes will help everyone come to a **consensus**."}
      prependedPostIds={prependedPostIds}
      navigation={navigation}
      primaryButtonLabel="Demand"
      sort="top"
    />
  );
}