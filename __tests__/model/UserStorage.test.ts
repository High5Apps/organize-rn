import { User } from '../../app/model';
import { getStoredUser, setStoredUser } from '../../app/model/UserStorage';

const fakeUser = User({ orgId: 'fakeOrgId' });
const otherFakeUser = User({ orgId: 'otherFakeOrgId' });

describe('getStoredUser', () => {
  it('initially returns null', async () => {
    const storedUser = await getStoredUser();
    expect(storedUser).toBeNull();
  });

  it('returns the last user stored with setStoredUser', async () => {
    await setStoredUser(fakeUser);
    let storedUser = await getStoredUser();
    expect(storedUser?.equals(fakeUser)).toBeTruthy();

    await setStoredUser(otherFakeUser);
    storedUser = await getStoredUser();
    expect(storedUser?.equals(otherFakeUser)).toBeTruthy();
  });
});
