export const MILLISECONDS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
export const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY;
export const SECONDS_PER_YEAR = 52 * SECONDS_PER_WEEK; // Note this is 364 days
export const JUST_NOW = 'just now';

export default function getMessageAge(
  messageCreatedAt: Date,
  maybeNow?: Date,
): string {
  const now = maybeNow ?? new Date();
  const secondsAgo = (
    now.getTime() - messageCreatedAt.getTime()
  ) / MILLISECONDS_PER_SECOND;

  if (secondsAgo < SECONDS_PER_MINUTE) {
    return JUST_NOW;
  }

  if (secondsAgo < SECONDS_PER_HOUR) {
    const minutes = Math.floor(secondsAgo / SECONDS_PER_MINUTE);
    return `${minutes}m ago`;
  }

  if (secondsAgo < SECONDS_PER_DAY) {
    const hours = Math.floor(secondsAgo / SECONDS_PER_HOUR);
    return `${hours}h ago`;
  }

  if (secondsAgo < 2 * SECONDS_PER_WEEK) {
    const days = Math.floor(secondsAgo / SECONDS_PER_DAY);
    return `${days}d ago`;
  }

  if (secondsAgo < SECONDS_PER_YEAR) {
    const weeks = Math.floor(secondsAgo / SECONDS_PER_WEEK);
    return `${weeks}w ago`;
  }

  const years = Math.floor(secondsAgo / SECONDS_PER_YEAR);
  return `${years}y ago`;
}
