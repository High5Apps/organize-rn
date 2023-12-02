import {
  MILLISECONDS_PER_SECOND, SECONDS_PER_DAY, SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE, SECONDS_PER_WEEK,
} from '../../app/model/MessageAge';
import getTimeRemaining from '../../app/model/TimeRemaining';

function getDateFromOffset(now: Date, timespanSeconds: number) {
  const nowSeconds = now.getTime() / 1000; // in seconds
  const timestamp = nowSeconds + timespanSeconds;
  return new Date(timestamp * MILLISECONDS_PER_SECOND);
}

describe('getMessageAge', () => {
  const now = new Date();
  const options = { now };

  it('should show negative time remaining as 0s left', () => {
    const expiration = getDateFromOffset(now, -1);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('0s left');
  });

  it('should show no time remaining as 0s left', () => {
    const expiration = getDateFromOffset(now, 0);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('0s left');
  });

  it('should show 1 second remaining as 1s left', () => {
    const expiration = getDateFromOffset(now, 1);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('1s left');
  });

  it('should show 1.9 seconds remaining as 1s left', () => {
    const expiration = getDateFromOffset(now, 1.9);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('1s left');
  });

  it('should show 1 second less than a minute remaining as 59s left', () => {
    const expiration = getDateFromOffset(now, SECONDS_PER_MINUTE - 1);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('59s left');
  });

  it('should show a minute remaining as 1m left', () => {
    const expiration = getDateFromOffset(now, SECONDS_PER_MINUTE);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('1m left');
  });

  it('should show 1 second less than an hour remaining as 59m left', () => {
    const expiration = getDateFromOffset(now, SECONDS_PER_HOUR - 1);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('59m left');
  });

  it('should show an hour remaining as 1h left', () => {
    const expiration = getDateFromOffset(now, SECONDS_PER_HOUR);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('1h left');
  });

  it('should show 1 second less than a day remaining as 23h left', () => {
    const expiration = getDateFromOffset(now, SECONDS_PER_DAY - 1);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('23h left');
  });

  it('should show a day remaining as 1d left', () => {
    const expiration = getDateFromOffset(now, SECONDS_PER_DAY);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('1d left');
  });

  it('should show 1 second less than two weeks remaining as 13d left', () => {
    const expiration = getDateFromOffset(now, 2 * SECONDS_PER_WEEK - 1);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('13d left');
  });

  it('should show two weeks remaining as 2w left', () => {
    const expiration = getDateFromOffset(now, 2 * SECONDS_PER_WEEK);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('2w left');
  });

  it('should show 100 weeks remaining as 100w left', () => {
    const expiration = getDateFromOffset(now, 100 * SECONDS_PER_WEEK);
    const age = getTimeRemaining(expiration, options);
    expect(age).toBe('100w left');
  });

  describe('formatter', () => {
    it('should allow changing the format', () => {
      const expiration = getDateFromOffset(now, SECONDS_PER_MINUTE - 1);
      const formatter = (s: string) => `Only ${s} remaining!`;
      const age = getTimeRemaining(expiration, { ...options, formatter });
      expect(age).toBe('Only 59s remaining!');
    });
  });

  describe('expiredFormatter', () => {
    it('should allow changing the expired format', () => {
      const expiration = getDateFromOffset(now, 0);
      const unusedFormatter = (s: string) => `Not used (${s})`;
      const expiredFormatter = (s: string) => `No time (${s}) remaining!`;
      const age = getTimeRemaining(expiration, {
        ...options, expiredFormatter, formatter: unusedFormatter,
      });
      expect(age).toBe('No time (0s) remaining!');
    });

    it('should fallback to using custom format', () => {
      const expiration = getDateFromOffset(now, 0);
      const formatter = (s: string) => `Used (${s})`;
      const age = getTimeRemaining(expiration, { ...options, formatter });
      expect(age).toBe('Used (0s)');
    });
  });
});
