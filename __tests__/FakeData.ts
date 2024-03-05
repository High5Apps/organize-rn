import type {
  Comment, CurrentUserData, Org, Post,
} from '../app/model';

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

export const fakeCurrentUser: CurrentUserData = {
  authenticationKeyId: 'fakeAuthenticationKeyId',
  encryptedGroupKey: 'fakeEncryptedGroupKey',
  id: 'fakeCurrentUser',
  localEncryptionKeyId: 'fakeLocalEncryptionKeyId',
  org: fakeOrg,
  orgId: fakeOrg.id,
  pseudonym: 'Fearless Hawk',
};
export const fakeOtherCurrentUser: CurrentUserData = {
  authenticationKeyId: 'otherFakeAuthenticationKeyId',
  encryptedGroupKey: 'otherFakeEncryptedGroupKey',
  id: 'fakeOtherCurrentUser',
  localEncryptionKeyId: 'otherFakeLocalEncryptionKeyId',
  org: fakeOtherOrg,
  orgId: fakeOtherOrg.id,
  pseudonym: 'Glorious Stingray',
};

export const fakeJwtString = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE2ODE2NTYzMzcsInNjcCI6ImNyZWF0ZTpjb25uZWN0aW9ucyIsInN1YiI6ImQwMjFjMWRkLWVhMDQtNDNmOS04MDg3LWEwZDcxNzJiZGVmMiJ9.t_Adk17S4KFhD7XNFn5Bf6Y2MJqOrghiFBKQRrnRdrOiFoFL-qhUu0HyEgviaono-aOzkdGewmx0w7labcdefg';
export const fakeGroupKey = 'abcdefgxp3bzF+yoN7zTzEzmipJW6xKnPKFASWKJr5Q=';

export function getFakePost(postId: string, score: number): Post {
  return {
    category: 'general',
    createdAt: new Date(),
    id: `post${postId}`,
    myVote: 0,
    pseudonym: fakeCurrentUser.pseudonym,
    score,
    title: `Post ${postId}`,
    userId: fakeCurrentUser.id,
  };
}

export function getFakeComment(commentId: string, score: number): Comment {
  return {
    body: `Comment ${commentId}`,
    createdAt: new Date(),
    depth: 0,
    id: `comment${commentId}`,
    myVote: 0,
    pseudonym: fakeCurrentUser.pseudonym,
    score,
    userId: fakeCurrentUser.id,
  };
}
