import i18n from '../../i18n';

export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
export const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY;
export const SECONDS_PER_YEAR = 52 * SECONDS_PER_WEEK; // Note this is 364 days

export default function getMessageAge(
  messageCreatedAt: Date,
  maybeNow?: Date,
): string {
  const now = maybeNow ?? new Date();
  const secondsAgo = (
    now.getTime() - messageCreatedAt.getTime()
  ) / MILLISECONDS_PER_SECOND;

  if (secondsAgo < SECONDS_PER_MINUTE) {
    return i18n.t('time.now');
  }

  let duration: string;
  if (secondsAgo < SECONDS_PER_HOUR) {
    const minutes = Math.floor(secondsAgo / SECONDS_PER_MINUTE);
    duration = i18n.t('time.duration.narrow.minutes', { minutes });
  } else if (secondsAgo < SECONDS_PER_DAY) {
    const hours = Math.floor(secondsAgo / SECONDS_PER_HOUR);
    duration = i18n.t('time.duration.narrow.hours', { hours });
  } else if (secondsAgo < 2 * SECONDS_PER_WEEK) {
    const days = Math.floor(secondsAgo / SECONDS_PER_DAY);
    duration = i18n.t('time.duration.narrow.days', { days });
  } else if (secondsAgo < SECONDS_PER_YEAR) {
    const weeks = Math.floor(secondsAgo / SECONDS_PER_WEEK);
    duration = i18n.t('time.duration.narrow.weeks', { weeks });
  } else {
    const years = Math.floor(secondsAgo / SECONDS_PER_YEAR);
    duration = i18n.t('time.duration.narrow.years', { years });
  }
  return i18n.t('time.duration.relative.past', { duration });
}
