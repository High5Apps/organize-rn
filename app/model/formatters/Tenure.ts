import i18n from '../../i18n';
import { isDefined } from '../types';

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
    const days = Math.floor(daysSinceStart);
    return i18n.t('time.duration.narrow.days', { days });
  }

  if (daysSinceStart < 365) {
    const weeks = Math.floor(weeksSinceStart);
    return i18n.t('time.duration.narrow.weeks', { weeks });
  }

  const years = Math.floor(yearsSinceStart);
  return i18n.t('time.duration.narrow.years', { years });
}
