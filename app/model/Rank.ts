export const officerRankOrder = [
  'Founder',
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Steward',
  'Trustee',
];

export function getHighestRank(offices?: string[]): number {
  const minRankReducer = (minRank: number, office: string) => {
    const rank = officerRankOrder.indexOf(office);
    return Math.min(rank, minRank);
  };
  const maxRank = officerRankOrder.length;
  return offices?.reduce(minRankReducer, maxRank) ?? maxRank;
}

export function getHighestOffice(offices?: string[]): string | undefined {
  const highestRank = getHighestRank(offices);
  const highestOffice = officerRankOrder[highestRank];
  return highestOffice;
}
