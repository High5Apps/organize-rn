import { getRankedResults } from '../../app/components/hooks/Ballot';
import { getFakeBallot } from '../FakeData';

describe('getRankedResults', () => {
  it('preserves the association between candidate and vote count', () => {
    const voteCounts = [5, 4, 4, 1];
    const ballot = getFakeBallot(voteCounts);
    getRankedResults(ballot)?.forEach(({ candidate: { id }, voteCount }, i) => {
      expect(parseInt(id, 10)).toEqual(i);
      expect(voteCount).toEqual(voteCounts[i]);
    });
  });

  it('returns undefined when ballot is undefined', () => {
    const rankedResults = getRankedResults(undefined);
    expect(rankedResults).toBeUndefined();
  });

  it.each([
    [[5, 3], [0, 1]],
    [[5, 5], [1, 1]],
    [[0, 0], [1, 1]],
    [[5, 3, 2, 1], [0, 1, 2, 3]],
    [[5, 5, 5, 5], [3, 3, 3, 3]],
    [[0, 0, 0, 0], [3, 3, 3, 3]],
    [[5, 5, 1, 0], [1, 1, 2, 3]],
    [[5, 1, 1, 0], [0, 2, 2, 3]],
    [[5, 3, 1, 1], [0, 1, 3, 3]],
    [[5, 3, 0, 0], [0, 1, 3, 3]],
    [[5, 5, 5, 1, 0], [2, 2, 2, 3, 4]],
    [[5, 1, 1, 1, 0], [0, 3, 3, 3, 4]],
    [[5, 3, 1, 1, 1], [0, 1, 4, 4, 4]],
  ])('downranks ties correctly: %p -> %p', (voteCounts, expectedRankings) => {
    const ballot = getFakeBallot(voteCounts);
    const rankings = getRankedResults(ballot)?.map(({ rank }) => rank);
    expect(rankings).toEqual(expectedRankings);
  });
});
