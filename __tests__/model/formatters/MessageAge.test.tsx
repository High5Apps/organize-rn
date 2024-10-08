import getMessageAge, {
  MILLISECONDS_PER_SECOND, SECONDS_PER_DAY, SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE, SECONDS_PER_WEEK, SECONDS_PER_YEAR,
} from '../../../app/model/formatters/MessageAge';

function getDateFromOffset(now: Date, timespanSeconds: number) {
  const nowSeconds = now.getTime() / 1000; // in seconds
  const timestamp = nowSeconds - timespanSeconds;
  return new Date(timestamp * MILLISECONDS_PER_SECOND);
}

describe('getMessageAge', () => {
  const now = new Date();

  it('should show 1 second less than a minute as just now', () => {
    const messageCreatedAt = getDateFromOffset(now, SECONDS_PER_MINUTE - 1);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('just now');
  });

  it('should show 1 second less than an hour as 59m ago', () => {
    const messageCreatedAt = getDateFromOffset(now, SECONDS_PER_HOUR - 1);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('59m ago');
  });

  it('should show 1 second less than a day as 23h ago', () => {
    const messageCreatedAt = getDateFromOffset(now, SECONDS_PER_DAY - 1);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('23h ago');
  });

  it('should show 1 second less than 2 weeks as 13d ago', () => {
    const messageCreatedAt = getDateFromOffset(now, 2 * SECONDS_PER_WEEK - 1);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('13d ago');
  });

  it('should show 1 second less than a 52-week, 364-day year as 51w ago', () => {
    const messageCreatedAt = getDateFromOffset(now, SECONDS_PER_YEAR - 1);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('51w ago');
  });

  it('should show a 52-week, 364-day year as 1y ago', () => {
    const messageCreatedAt = getDateFromOffset(now, SECONDS_PER_YEAR);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('1y ago');
  });

  it('should show 2 52-week, 364-day years as 2y ago', () => {
    const messageCreatedAt = getDateFromOffset(now, 2 * SECONDS_PER_YEAR);
    const age = getMessageAge(messageCreatedAt, now);
    expect(age).toBe('2y ago');
  });
});
