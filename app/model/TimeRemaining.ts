import {
  MILLISECONDS_PER_SECOND, SECONDS_PER_DAY, SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE, SECONDS_PER_WEEK,
} from './MessageAge';

type Options = {
  formatter?: (timeRemaining: string) => string;
  now?: Date;
};

const defaultFormatter = (timeRemaining: string) => (`${timeRemaining} left`);

export default function getTimeRemaining(expiration: Date, {
  formatter: maybeFormatter, now: maybeNow,
}: Options = {}) {
  const formatter = maybeFormatter ?? defaultFormatter;
  const now = maybeNow ?? new Date();
  const secondsRemaining = (
    expiration.getTime() - now.getTime()
  ) / MILLISECONDS_PER_SECOND;

  if (secondsRemaining < 0) {
    return formatter('0s');
  }

  if (secondsRemaining < SECONDS_PER_MINUTE) {
    const seconds = Math.floor(secondsRemaining);
    return formatter(`${seconds}s`);
  }

  if (secondsRemaining < SECONDS_PER_HOUR) {
    const minutes = Math.floor(secondsRemaining / SECONDS_PER_MINUTE);
    return formatter(`${minutes}m`);
  }

  if (secondsRemaining < SECONDS_PER_DAY) {
    const hours = Math.floor(secondsRemaining / SECONDS_PER_HOUR);
    return formatter(`${hours}h`);
  }

  if (secondsRemaining < 2 * SECONDS_PER_WEEK) {
    const days = Math.floor(secondsRemaining / SECONDS_PER_DAY);
    return formatter(`${days}d`);
  }

  const weeks = Math.floor(secondsRemaining / SECONDS_PER_WEEK);
  return formatter(`${weeks}w`);
}
