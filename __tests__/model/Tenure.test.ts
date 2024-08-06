import getTenure from '../../app/model/Tenure';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDateFromOffsetDays(now: Date, timespanDays: number) {
  const nowMilliseconds = now.getTime();
  const timestamp = nowMilliseconds - timespanDays * MS_PER_DAY;
  return new Date(timestamp);
}

describe('getTenure', () => {
  const now = new Date();

  it('should show first day as 0d', () => {
    const joinedAt = getDateFromOffsetDays(now, 0);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('0d');
  });

  it('should show day 13 as 13d', () => {
    const joinedAt = getDateFromOffsetDays(now, 13);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('13d');
  });

  it('should show day 14 as 2w', () => {
    const joinedAt = getDateFromOffsetDays(now, 14);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('2w');
  });

  it('should show day 363 as 51w', () => {
    const joinedAt = getDateFromOffsetDays(now, 363);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('51w');
  });

  it('should show day 364 as 52w', () => {
    const joinedAt = getDateFromOffsetDays(now, 364);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('52w');
  });

  it('should show day 365 as 1y', () => {
    const joinedAt = getDateFromOffsetDays(now, 365);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('1y');
  });

  it('should show day 729 as 1y', () => {
    const joinedAt = getDateFromOffsetDays(now, 729);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('1y');
  });

  it('should show day 730 as 2y', () => {
    const joinedAt = getDateFromOffsetDays(now, 730);
    const tenure = getTenure(joinedAt, { now });
    expect(tenure).toBe('2y');
  });

  it('should use blockedAt as end time instead of now when present', () => {
    const joinedAt = getDateFromOffsetDays(now, 3);
    const blockedAt = getDateFromOffsetDays(now, 1);
    const tenure = getTenure(joinedAt, { blockedAt, now });
    expect(tenure).toBe('2d');
  });

  it('should use leftOrgAt as end time instead of now when present', () => {
    const joinedAt = getDateFromOffsetDays(now, 3);
    const leftOrgAt = getDateFromOffsetDays(now, 1);
    const tenure = getTenure(joinedAt, { leftOrgAt, now });
    expect(tenure).toBe('2d');
  });

  it('should use the earlier of blockedAt, leftOrgAt as end time instead of now when present', () => {
    const joinedAt = getDateFromOffsetDays(now, 5);
    let leftOrgAt = getDateFromOffsetDays(now, 4);
    let blockedAt = getDateFromOffsetDays(now, 3);
    let tenure = getTenure(joinedAt, { blockedAt, leftOrgAt, now });
    expect(tenure).toBe('1d');

    leftOrgAt = getDateFromOffsetDays(now, 3);
    blockedAt = getDateFromOffsetDays(now, 4);
    tenure = getTenure(joinedAt, { blockedAt, leftOrgAt, now });
    expect(tenure).toBe('1d');
  });
});
