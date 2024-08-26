import type { CurrentUserData, Org, Post } from '../app/model';

const fakeOrg: Org = {
  id: 'fakeOrgId',
  name: 'fakeOrgName',
  memberDefinition: 'fakeDefinition',
};

const fakeOtherOrg: Org = {
  id: 'fakeOtherOrgId',
  name: 'fakeOtherOrgName',
  memberDefinition: 'fakeOtherDefinition',
};

export const fakeCurrentUserData: CurrentUserData = {
  authenticationKeyId: 'fakeAuthenticationKeyId',
  connectionCount: 0,
  encryptedGroupKey: 'fakeEncryptedGroupKey',
  id: 'fakeCurrentUserData',
  joinedAt: new Date(),
  localEncryptionKeyId: 'fakeLocalEncryptionKeyId',
  offices: [],
  org: fakeOrg,
  pseudonym: 'Fearless Hawk',
  recruitCount: 0,
};
export const fakeOtherCurrentUserData: CurrentUserData = {
  authenticationKeyId: 'otherFakeAuthenticationKeyId',
  connectionCount: 0,
  encryptedGroupKey: 'otherFakeEncryptedGroupKey',
  id: 'fakeOtherCurrentUserData',
  joinedAt: new Date(),
  localEncryptionKeyId: 'otherFakeLocalEncryptionKeyId',
  offices: [],
  org: fakeOtherOrg,
  pseudonym: 'Glorious Stingray',
  recruitCount: 0,
};

export const fakeJwtString = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE2ODE2NTYzMzcsInNjcCI6ImNyZWF0ZTpjb25uZWN0aW9ucyIsInN1YiI6ImQwMjFjMWRkLWVhMDQtNDNmOS04MDg3LWEwZDcxNzJiZGVmMiJ9.t_Adk17S4KFhD7XNFn5Bf6Y2MJqOrghiFBKQRrnRdrOiFoFL-qhUu0HyEgviaono-aOzkdGewmx0w7labcdefg';
export const fakeGroupKey = 'abcdefgxp3bzF+yoN7zTzEzmipJW6xKnPKFASWKJr5Q=';

export function getFakePost(postId: string, score: number): Post {
  return {
    category: 'general',
    createdAt: new Date(),
    deletedAt: null,
    id: `post${postId}`,
    myVote: 0,
    pseudonym: fakeCurrentUserData.pseudonym,
    score,
    title: `Post ${postId}`,
    userId: fakeCurrentUserData.id,
  };
}
