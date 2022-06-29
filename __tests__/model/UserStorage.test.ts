import { isCurrentUserData } from '../../app/model';
import { getStoredUser, setStoredUser } from '../../app/model/UserStorage';
import { fakeCurrentUser, fakeOtherCurrentUser, fakeUser } from '../FakeData';

describe('UserStorage', () => {
  beforeEach(async () => {
    await setStoredUser(null);
    const storedUser = await getStoredUser();
    expect(storedUser).toBeNull();
    expect(isCurrentUserData(fakeCurrentUser)).toBeTruthy();
    expect(isCurrentUserData(fakeOtherCurrentUser)).toBeTruthy();
  });

  describe('getStoredUser', () => {
    it('returns the last user stored with setStoredUser', async () => {
      await setStoredUser(fakeCurrentUser);
      let storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeCurrentUser)).toBeTruthy();

      await setStoredUser(fakeOtherCurrentUser);
      storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeOtherCurrentUser)).toBeTruthy();
    });
  });

  describe('setStoredUser', () => {
    it('should store valid user data', async () => {
      await setStoredUser(fakeOtherCurrentUser);
      const storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeOtherCurrentUser)).toBeTruthy();
    });

    it('should store null user data', async () => {
      await setStoredUser(fakeOtherCurrentUser);
      let storedUser = await getStoredUser();
      expect(storedUser).toBeTruthy();

      await setStoredUser(null);
      storedUser = await getStoredUser();
      expect(storedUser).toBeNull();
    });

    it('should not store invalid user data', async () => {
      jest.spyOn(console, 'warn').mockImplementation();
      expect(isCurrentUserData(fakeUser)).toBeFalsy();
      setStoredUser(fakeUser);
      const storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeUser)).toBeFalsy();
    });
  });
});
