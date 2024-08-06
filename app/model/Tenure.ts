import { isDefined } from './types';

type Options = {
  blockedAt?: Date;
  leftOrgAt?: Date;
  now?: Date;
};

export default function getTenure(
  joinedAt: Date,
  options: Options = {},
): string {
  const now = options.now ?? new Date();
  const end = new Date(Math.min(
    ...[options.blockedAt, options.leftOrgAt, now]
      .filter(isDefined)
      .map((d) => d.getTime()),
  ));
  const millisecondsSinceStart = end.getTime() - joinedAt.getTime();
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
