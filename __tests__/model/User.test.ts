import { User } from '../../app/model';

const id = 'fakeId';
const orgId = 'fakeOrgId';

describe('User', () => {
  it('should set id if included', () => {
    const u = User({ id, orgId });
    expect(u.id).toBe(id);
  });

  it('should create id if not included', () => {
    const u = User({ orgId });
    expect(u.id).toBeDefined();
    expect(u.id).not.toBe(id);
  });
});
