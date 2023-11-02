import { User } from '../../app/model';
import { UserType } from '../../app/model/User';
import { fakeOtherUser, fakeUser } from '../FakeData';

const { id, orgId, pseudonym } = fakeUser;
const {
  id: otherId, orgId: otherOrgId, pseudonym: otherPseudonym,
} = fakeOtherUser;

type Props = {
  equal: boolean;
  user: UserType;
  otherUser: UserType;
};

function expectUsersEqual({ equal, user, otherUser }: Props) {
  // See https://github.com/facebook/jest/issues/8475#issuecomment-496011355
  const deleteKeys = expect.any(Function);
  const equals = expect.any(Function);
  const createAuthToken = expect.any(Function);
  const decryptGroupKey = expect.any(Function);
  const e2eDecrypt = expect.any(Function);
  const e2eDecryptMany = expect.any(Function);
  const e2eEncrypt = expect.any(Function);
  const expected = {
    ...otherUser,
    createAuthToken,
    decryptGroupKey,
    deleteKeys,
    equals,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncrypt,
  };
  if (equal) {
    expect(user).toEqual(expected);
  } else {
    expect(user).not.toEqual(expected);
  }
}

describe('User', () => {
  it('should set id if included', () => {
    const u = User({ id, orgId, pseudonym });
    expect(u.id).toBe(id);
  });

  it('should create id if not included', () => {
    const u = User({ orgId, pseudonym });
    expect(u.id).toBeDefined();
    expect(u.id).not.toBe(id);
  });

  describe('equals', () => {
    it('should be true when user is the same', () => {
      const user = User({ id, orgId, pseudonym });
      expectUsersEqual({
        equal: true,
        user,
        otherUser: user,
      });
    });

    it('should be true when user data is equal', () => {
      expectUsersEqual({
        equal: true,
        user: User({ id, orgId, pseudonym }),
        otherUser: User({ id, orgId, pseudonym }),
      });
    });

    it('should be false when userId is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User({ id, orgId, pseudonym }),
        otherUser: User({ id: otherId, orgId, pseudonym: otherPseudonym }),
      });
    });

    it('should be false when orgId is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User({ id, orgId, pseudonym }),
        otherUser: User({ id, orgId: otherOrgId, pseudonym }),
      });
    });

    it('should be false when pseudonym is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User({ id, orgId, pseudonym }),
        otherUser: User({ id, orgId, pseudonym: otherPseudonym }),
      });
    });
  });
});
