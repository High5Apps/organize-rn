import i18n from '../../i18n';
import {
  MILLISECONDS_PER_SECOND, SECONDS_PER_DAY, SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE, SECONDS_PER_WEEK,
} from './MessageAge';

export type TimeRemainingOptions = {
  expiredFormatter?: (timeRemaining: string) => string;
  formatter?: (timeRemaining: string) => string;
  now?: Date;
};

const defaultFormatter = (timeRemaining: string) => (
  i18n.t('time.hint.remaining.default', { timeRemaining })
);

export default function getTimeRemaining(expiration: Date, {
  expiredFormatter: maybeExpiredFormatter, formatter: maybeFormatter,
  now: maybeNow,
}: TimeRemainingOptions = {}) {
  const formatter = maybeFormatter ?? defaultFormatter;
  const expiredFormatter = maybeExpiredFormatter ?? formatter;
  const now = maybeNow ?? new Date();
  const secondsRemaining = (
    expiration.getTime() - now.getTime()
  ) / MILLISECONDS_PER_SECOND;

  if (secondsRemaining <= 0) {
    return expiredFormatter('0s');
  }

  let duration: string;
  if (secondsRemaining < SECONDS_PER_MINUTE) {
    const seconds = Math.floor(secondsRemaining);
    duration = i18n.t('time.duration.narrow.seconds', { seconds });
  } else if (secondsRemaining < SECONDS_PER_HOUR) {
    const minutes = Math.floor(secondsRemaining / SECONDS_PER_MINUTE);
    duration = i18n.t('time.duration.narrow.minutes', { minutes });
  } else if (secondsRemaining < SECONDS_PER_DAY) {
    const hours = Math.floor(secondsRemaining / SECONDS_PER_HOUR);
    duration = i18n.t('time.duration.narrow.hours', { hours });
  } else if (secondsRemaining < 2 * SECONDS_PER_WEEK) {
    const days = Math.floor(secondsRemaining / SECONDS_PER_DAY);
    duration = i18n.t('time.duration.narrow.days', { days });
  } else {
    const weeks = Math.floor(secondsRemaining / SECONDS_PER_WEEK);
    duration = i18n.t('time.duration.narrow.weeks', { weeks });
  }
  return formatter(duration);
}
