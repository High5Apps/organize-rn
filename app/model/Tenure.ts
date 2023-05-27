export default function getTenure(joinedAt: number, now?: number): string {
  const timestampMs = now ?? new Date().getTime();

  const millisecondsSinceStart = timestampMs - joinedAt;
  const daysSinceStart = millisecondsSinceStart / 1000 / 60 / 60 / 24;
  const weeksSinceStart = daysSinceStart / 7;
  const yearsSinceStart = daysSinceStart / 365;

  if (daysSinceStart < 14) {
    return `${Math.floor(daysSinceStart)}d`;
  }

  if (daysSinceStart < 365) {
    return `${Math.floor(weeksSinceStart)}w`;
  }

  return `${Math.floor(yearsSinceStart)}y`;
}
