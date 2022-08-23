import { User } from '../../app/model';
import { UserType } from '../../app/model/User';

const id = 'fakeId';
const otherId = 'otherFakeId';
const orgId = 'fakeOrgId';
const otherOrgId = 'otherOrgId';

type Props = {
  equal: boolean;
  user: UserType;
  otherUser: UserType;
};

function expectUsersEqual({ equal, user, otherUser }: Props) {
  // See https://github.com/facebook/jest/issues/8475#issuecomment-496011355
  const deleteKeyPair = expect.any(Function);
  const equals = expect.any(Function);
  const createAuthToken = expect.any(Function);
  const expected = {
    ...otherUser, createAuthToken, deleteKeyPair, equals,
  };
  if (equal) {
    expect(user).toEqual(expected);
  } else {
    expect(user).not.toEqual(expected);
  }
}

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

  describe('equals', () => {
    it('should be true when user is the same', () => {
      const user = User({ id, orgId });
      expectUsersEqual({
        equal: true,
        user,
        otherUser: user,
      });
    });

    it('should be true when user data is equal', () => {
      expectUsersEqual({
        equal: true,
        user: User({ id, orgId }),
        otherUser: User({ id, orgId }),
      });
    });

    it('should be false when userId is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User({ id, orgId }),
        otherUser: User({ id: otherId, orgId }),
      });
    });

    it('should be false when orgId is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User({ id, orgId }),
        otherUser: User({ id, orgId: otherOrgId }),
      });
    });
  });
});
