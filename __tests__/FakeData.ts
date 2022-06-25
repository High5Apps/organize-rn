import { Org, User } from '../app/model';

export const fakeOrg: Org = {
  id: 'fakeOrgId',
  name: 'fakeOrgName',
  potentialMemberCount: 99,
  potentialMemberDefinition: 'fakeDefinition',
};

export const fakeUser = User({ orgId: fakeOrg.id });
export const fakeOtherUser = User({ orgId: fakeOrg.id });

export const fakeCurrentUser = User({ org: fakeOrg, orgId: fakeOrg.id });
export const fakeOtherCurrentUser = User({ org: fakeOrg, orgId: fakeOrg.id });
