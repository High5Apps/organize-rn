import {
  MILLISECONDS_PER_SECOND, SECONDS_PER_DAY, SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE, SECONDS_PER_WEEK,
} from './MessageAge';

export default function getTimeRemaining(
  expiration: Date,
  maybeNow?: Date,
) {
  const now = maybeNow ?? new Date();
  const secondsRemaining = (
    expiration.getTime() - now.getTime()
  ) / MILLISECONDS_PER_SECOND;

  if (secondsRemaining < 0) {
    return '0s left';
  }

  if (secondsRemaining < SECONDS_PER_MINUTE) {
    const seconds = Math.floor(secondsRemaining);
    return `${seconds}s left`;
  }

  if (secondsRemaining < SECONDS_PER_HOUR) {
    const minutes = Math.floor(secondsRemaining / SECONDS_PER_MINUTE);
    return `${minutes}m left`;
  }

  if (secondsRemaining < SECONDS_PER_DAY) {
    const hours = Math.floor(secondsRemaining / SECONDS_PER_HOUR);
    return `${hours}h left`;
  }

  if (secondsRemaining < 2 * SECONDS_PER_WEEK) {
    const days = Math.floor(secondsRemaining / SECONDS_PER_DAY);
    return `${days}d left`;
  }

  const weeks = Math.floor(secondsRemaining / SECONDS_PER_WEEK);
  return `${weeks}w left`;
}
