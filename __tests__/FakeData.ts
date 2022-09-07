import { Org, User } from '../app/model';

export const fakeOrg: Org = {
  id: 'fakeOrgId',
  name: 'fakeOrgName',
  potentialMemberCount: 99,
  potentialMemberDefinition: 'fakeDefinition',
};

export const fakeOtherOrg: Org = {
  id: 'fakeOtherOrgId',
  name: 'fakeOtherOrgName',
  potentialMemberCount: 1000,
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

export const fakeJwtString = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYjc4YmRkYi1mY2FlLTQ1MGQtOGQ4MC00MDdjMDQ3YjI1NDciLCJleHAiOjE2NTc2MDU2NzkuNzE4fQ.ixM2MAN55YKyLDri3evH-Fr9dq36bpa7PpnNNKqcZlj9Q-Cp2fzu958nr-80MJZLAR_UIq37LFqHSJA2b3-P_WBvVc_YBiONhIXvgyFfhnpBAClPLtGojEN9bUIX78NkptjnHTzfS_RmLbc6sxBgcDDVP1wVl6FcUnHx5fIs2TkSzKGu74gGLP58xXbMxU7kA8EKza3jQzLMLdqjGP_54hmfONAwAJdpV46ywv6Gy-Q5-lJh0dUIKS8JuXUxc89jrBwhnlsfIMoJhto20xI_mvnN2t8WXsSgcULjwuQyfrPR1nM4UB9_XlKmkItJQINfnhIllszy0rwGMUF4B3V-_Q';
export const fakeJwtExpiration = 1657605679.718;
export const fakeJwtSubject = 'eb78bddb-fcae-450d-8d80-407c047b2547';
