import { User } from '../../app/model';
import { StorableUser } from '../../app/model/User';
import { fakeCurrentUser, fakeOtherCurrentUser } from '../FakeData';

type Props = {
  equal: boolean;
  user: StorableUser;
  otherUser: StorableUser;
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
  const e2eEncryptMany = expect.any(Function);
  const expected = {
    ...otherUser,
    createAuthToken,
    decryptGroupKey,
    deleteKeys,
    equals,
    e2eDecrypt,
    e2eDecryptMany,
    e2eEncrypt,
    e2eEncryptMany,
  };
  if (equal) {
    expect(user).toEqual(expected);
  } else {
    expect(user).not.toEqual(expected);
  }
}

describe('User', () => {
  it('should set id', () => {
    const u = User(fakeCurrentUser);
    expect(u.id).toBe(fakeCurrentUser.id);
  });

  describe('equals', () => {
    it('should be true when user is the same', () => {
      const user = User(fakeCurrentUser);
      expectUsersEqual({
        equal: true,
        user,
        otherUser: user,
      });
    });

    it('should be true when user data is equal', () => {
      expectUsersEqual({
        equal: true,
        user: User(fakeCurrentUser),
        otherUser: User(fakeCurrentUser),
      });
    });

    it('should be false when userId is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User(fakeCurrentUser),
        otherUser: User({ ...fakeCurrentUser, id: fakeOtherCurrentUser.id }),
      });
    });

    it('should be false when orgId is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User(fakeCurrentUser),
        otherUser: User({
          ...fakeCurrentUser, orgId: fakeOtherCurrentUser.orgId,
        }),
      });
    });

    it('should be false when pseudonym is unequal', () => {
      expectUsersEqual({
        equal: false,
        user: User(fakeCurrentUser),
        otherUser: User({
          ...fakeCurrentUser, pseudonym: fakeOtherCurrentUser.pseudonym,
        }),
      });
    });
  });
});
