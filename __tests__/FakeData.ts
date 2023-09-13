import { Org, Post, User } from '../app/model';

const fakeOrg: Org = {
  id: 'fakeOrgId',
  name: 'fakeOrgName',
  potentialMemberDefinition: 'fakeDefinition',
};

const fakeOtherOrg: Org = {
  id: 'fakeOtherOrgId',
  name: 'fakeOtherOrgName',
  potentialMemberDefinition: 'fakeOtherDefinition',
};

export const fakeUser = User({
  orgId: fakeOrg.id,
  pseudonym: 'Sincere Pelican',
});
export const fakeOtherUser = User({
  orgId: fakeOtherOrg.id,
  pseudonym: 'Bold Squirrel',
});

export const fakeCurrentUser = User({
  org: fakeOrg,
  orgId: fakeOrg.id,
  pseudonym: 'Fearless Hawk',
  publicKeyId: 'fakeKeyId',
});
export const fakeOtherCurrentUser = User({
  org: fakeOtherOrg,
  orgId: fakeOtherOrg.id,
  pseudonym: 'Glorious Stingray',
  publicKeyId: 'otherFakeKeyId',
});

export const fakeJwtString = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE2ODE2NTYzMzcsInNjcCI6ImNyZWF0ZTpjb25uZWN0aW9ucyIsInN1YiI6ImQwMjFjMWRkLWVhMDQtNDNmOS04MDg3LWEwZDcxNzJiZGVmMiJ9.t_Adk17S4KFhD7XNFn5Bf6Y2MJqOrghiFBKQRrnRdrOiFoFL-qhUu0HyEgviaono-aOzkdGewmx0w7labcdefg';

export function getFakePost(postId: string, score: number): Post {
  return {
    category: 'general',
    createdAt: new Date().getTime(),
    id: `post${postId}`,
    myVote: 0,
    pseudonym: fakeUser.pseudonym,
    score,
    title: `Post ${postId}`,
    userId: fakeUser.id,
  };
}
