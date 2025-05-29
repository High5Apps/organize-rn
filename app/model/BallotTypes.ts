import { useEffect, useMemo } from 'react';
import { useMyPermissions } from './context';
import { BallotType } from './types';
import i18n from '../i18n';

const ballotTypes: BallotType[] = [
  {
    category: 'yes_no',
    iconName: 'thumb-up',
    name: i18n.t('object.ballotType.yesOrNo'),
  },
  {
    category: 'multiple_choice',
    iconName: 'check-box',
    name: i18n.t('object.ballotType.multipleChoice'),
  },
  {
    category: 'election',
    iconName: 'person',
    name: i18n.t('object.ballotType.election'),
  },
];

export function getBallotTypeInfo(category: string): BallotType {
  return ballotTypes.find(
    (ballotType) => ballotType.category === category,
  ) ?? {
    category: 'unknown',
    iconName: 'warning',
    name: i18n.t('modifier.unknown'),
  };
}

export default function useBallotTypes() {
  const { can, refreshMyPermissions } = useMyPermissions({
    scopes: ['createElections'],
  });

  useEffect(() => {
    refreshMyPermissions().catch(console.error);
  }, []);

  const permittedBallotTypes = useMemo(() => ballotTypes.filter(
    ({ category }) => category !== 'election' || (can('createElections')),
  ), [can]);

  return { ballotTypes: permittedBallotTypes };
}
