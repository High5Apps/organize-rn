import { isCurrentUserData, Org, User } from '../../app/model';
import { getStoredUser, setStoredUser } from '../../app/model/UserStorage';

const fakeOrg: Org = {
  id: 'fakeOrgId',
  name: 'fakeOrgName',
  potentialMemberCount: 99,
  potentialMemberDefinition: 'fakeDefinition',
};
const fakeUser = User({ org: fakeOrg, orgId: fakeOrg.id });
const otherFakeUser = User({ org: fakeOrg, orgId: 'otherFakeOrgId' });

describe('UserStorage', () => {
  beforeEach(async () => {
    await setStoredUser(null);
    const storedUser = await getStoredUser();
    expect(storedUser).toBeNull();
  });

  describe('getStoredUser', () => {
    it('returns the last user stored with setStoredUser', async () => {
      await setStoredUser(fakeUser);
      let storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeUser)).toBeTruthy();

      await setStoredUser(otherFakeUser);
      storedUser = await getStoredUser();
      expect(storedUser?.equals(otherFakeUser)).toBeTruthy();
    });
  });

  describe('setStoredUser', () => {
    it('should store valid user data', async () => {
      await setStoredUser(fakeUser);
      const storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeUser)).toBeTruthy();
    });

    it('should store null user data', async () => {
      await setStoredUser(fakeUser);
      let storedUser = await getStoredUser();
      expect(storedUser).toBeTruthy();

      await setStoredUser(null);
      storedUser = await getStoredUser();
      expect(storedUser).toBeNull();
    });

    it('should not store invalid user data', () => {
      const userWithoutOrgData = User({ orgId: fakeOrg.id });
      expect(isCurrentUserData(userWithoutOrgData)).toBeFalsy();
    });
  });
});
