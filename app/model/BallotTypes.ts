import { useEffect, useMemo } from 'react';
import { useMyPermissions } from './context';
import { BallotType } from './types';

const ballotTypes: BallotType[] = [
  {
    category: 'yes_no',
    iconName: 'thumb-up',
    name: 'Yes or No',
  },
  {
    category: 'multiple_choice',
    iconName: 'check-box',
    name: 'Multiple Choice',
  },
  {
    category: 'election',
    iconName: 'person',
    name: 'Election',
  },
];

export function getBallotTypeInfo(category: string): BallotType {
  return ballotTypes.find(
    (ballotType) => ballotType.category === category,
  ) ?? {
    category: 'unknown',
    iconName: 'warning',
    name: 'Unknown',
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
