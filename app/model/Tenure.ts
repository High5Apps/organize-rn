export default function getTenure(joinedAt: Date, maybeNow?: Date): string {
  const now = maybeNow ?? new Date();

  const millisecondsSinceStart = now.getTime() - joinedAt.getTime();
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
