import { BallotCategory, BallotTypeInfo } from './types';

export const ballotTypes: BallotTypeInfo[] = [
  {
    category: 'yes_no',
    iconName: 'thumb-up',
    name: 'Yes or No',
    newScreenName: 'NewYesOrNoBallot',
  },
];

type BallotTypeMap = {
  [key in BallotCategory]: Omit<BallotTypeInfo, 'category'>;
};

export const ballotTypeMap = ballotTypes.reduce((
  accumulator,
  { category, ...rest },
) => ({ ...accumulator, [category]: rest }), {} as BallotTypeMap);
