import type { Candidate } from '../../model';

export type ResultType = 'error' | 'none' | 'success' | 'warning' | 'info';

export type RankedResult = {
  candidate: Candidate;
  rank: number;
  voteCount: number;
};
