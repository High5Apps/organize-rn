import getTenure from '../../app/model/Tenure';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

describe('getTenure', () => {
  const now = new Date().getTime();

  it('should show first day as 0d', () => {
    const joinedAt = now;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('0d');
  });

  it('should show day 13 as 13d', () => {
    const joinedAt = now - 13 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('13d');
  });

  it('should show day 14 as 2w', () => {
    const joinedAt = now - 14 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('2w');
  });

  it('should show day 363 as 51w', () => {
    const joinedAt = now - 363 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('51w');
  });

  it('should show day 364 as 52w', () => {
    const joinedAt = now - 364 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('52w');
  });

  it('should show day 365 as 1y', () => {
    const joinedAt = now - 365 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('1y');
  });

  it('should show day 729 as 1y', () => {
    const joinedAt = now - 729 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('1y');
  });

  it('should show day 730 as 2y', () => {
    const joinedAt = now - 730 * MS_PER_DAY;
    const tenure = getTenure(joinedAt, now);
    expect(tenure).toBe('2y');
  });
});
