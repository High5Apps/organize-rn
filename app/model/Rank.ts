export const officerRankOrder = [
  'Founder',
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Steward',
  'Trustee',
];

export default function getHighestRank(offices?: string[]): number {
  const minRankReducer = (minRank: number, office: string) => {
    const rank = officerRankOrder.indexOf(office);
    return Math.min(rank, minRank);
  };
  const maxRank = officerRankOrder.length;
  return offices?.reduce(minRankReducer, maxRank) ?? maxRank;
}
