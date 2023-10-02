import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussDemandsScreenProps } from '../navigation';

export default function DiscussDemandsScreen({
  navigation, route,
}: DiscussDemandsScreenProps) {
  const insertedPostIds = route.params?.insertedPostIds;

  return (
    <DiscussScreen <'Demands'>
      category="demands"
      emptyListMessage={"What are you really fighting for?\n\nDemands let you voice how **specific things should change for the better**.\n\nOver time, Org members' upvotes and downvotes will help everyone come to a **consensus**."}
      insertedPostIds={insertedPostIds}
      navigation={navigation}
      primaryButtonLabel="Demand"
      sort="top"
    />
  );
}
