import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGrievancesScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

export default function DiscussGrievancesScreen({
  navigation, route,
}: DiscussGrievancesScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  const { t } = useTranslation();

  return (
    <DiscussScreen <'Grievances'>
      category="grievances"
      emptyListMessage={t('hint.emptyGrievanceDiscussions')}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel={t('object.grievance', { count: 1 })}
      screenName={route.name}
      sort="top"
    />
  );
}
