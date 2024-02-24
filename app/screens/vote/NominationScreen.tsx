import React, { useLayoutEffect } from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import type { NominationScreenProps } from '../../navigation';
import { OfficeCategory, addMetadata, useBallotPreviews } from '../../model';

function useTitleUpdater(
  navigation: NominationScreenProps['navigation'],
  officeCategory: OfficeCategory,
) {
  useLayoutEffect(() => {
    const office = addMetadata({ type: officeCategory, open: true });
    const title = `Nominations for ${office.title}`;
    navigation.setOptions({ title });
  }, [navigation, officeCategory]);
}

export default function NominationScreen({
  navigation, route,
}: NominationScreenProps) {
  const { ballotId } = route.params;

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);
  if (!ballotPreview || ballotPreview.category !== 'election') {
    throw new Error('Expected ballotPreview to be defined and an election');
  }

  useTitleUpdater(navigation, ballotPreview.office);

  return <PlaceholderScreen name={route.name} />;
}
