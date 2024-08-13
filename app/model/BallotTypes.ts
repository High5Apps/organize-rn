import { useEffect, useMemo } from 'react';
import { useMyPermissions } from './context';
import { BallotCategory, BallotTypeInfo } from './types';

const ballotTypes: BallotTypeInfo[] = [
  {
    category: 'yes_no',
    iconName: 'thumb-up',
    name: 'Yes or No',
    newScreenName: 'NewYesOrNoBallot',
  },
  {
    category: 'multiple_choice',
    iconName: 'check-box',
    name: 'Multiple Choice',
    newScreenName: 'NewMultipleChoiceBallot',
  },
  {
    category: 'election',
    iconName: 'person',
    name: 'Election',
    newScreenName: 'NewElectionBallot',
    subtypeSelectionScreenName: 'OfficeAvailability',
  },
];

type BallotTypeMap = {
  [key in BallotCategory]: Omit<BallotTypeInfo, 'category'>;
};

export const ballotTypeMap = ballotTypes.reduce((
  accumulator,
  { category, ...rest },
) => ({ ...accumulator, [category]: rest }), {} as BallotTypeMap);

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
