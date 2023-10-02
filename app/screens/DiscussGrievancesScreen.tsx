import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGrievancesScreenProps } from '../navigation';

export default function DiscussGrievancesScreen({
  navigation, route,
}: DiscussGrievancesScreenProps) {
  const insertedPostIds = route.params?.insertedPostIds;

  return (
    <DiscussScreen <'Grievances'>
      category="grievances"
      emptyListMessage={"If you've experienced **issues in your workplace**, others may have experienced them too.\n\nGrievances offer a chance to **shine a light** on injustice, unethical behavior, and illegal practices."}
      insertedPostIds={insertedPostIds}
      navigation={navigation}
      primaryButtonLabel="Grievance"
      sort="top"
    />
  );
}
