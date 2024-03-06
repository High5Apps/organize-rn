import { useMemo } from 'react';
import { Data } from 'react-native-vis-network';
import useTheme, { ThemeColors } from '../Theme';
import { fetchOrg, getUser } from '../networking';
import {
  Office, Org, OrgGraph as OrgGraphType, User,
} from './types';
import getCircleColors from './OrgScreenCircleColors';
import useCurrentUser from './CurrentUser';
import { GENERIC_ERROR_MESSAGE } from './Errors';

function toVisNetworkData(
  colors: ThemeColors,
  officerMap?: { [key: string]: Office[] },
  currentUserId?: string,
  orgGraph?: OrgGraphType,
): Data | undefined {
  if (orgGraph === undefined || officerMap === undefined) { return undefined; }

  return {
    nodes: Object.keys(orgGraph.users).map((id) => {
      const offices = officerMap[id] ?? [];
      const isMe = (id === currentUserId);
      const {
        circleBorderColor, circleBackgroundColor, shadow,
      } = getCircleColors({ colors, isMe, offices });
      return {
        chosen: false,
        color: { background: circleBackgroundColor, border: circleBorderColor },
        id,
        shadow,
      };
    }),
    edges: orgGraph.connections.map(([from, to]) => ({
      chosen: false,
      from,
      to,
    })),
  };
}

// HACK: This is brittle in that it relies on the JSON ordering from the server
// being stable. Fortunately it seems like it is, and this check is relatively
// quick at 1-3ms for a 100-member Org. Plus it fails safe because if the order
// stops being stable for some reason, it would always return true, similar to
// the situation before this optimization was added. The "right" way to do this
// would be to include some kind of ETAG and caching strategy on the server
// which returns an HTTP 304 "not modified" response when unchanged.
function orgChanged(oldOrg: Org, newOrg: Org) {
  return JSON.stringify(oldOrg) !== JSON.stringify(newOrg);
}
function userChanged(user: User, otherUser: User) {
  return !Object.keys(user).every((key) => {
    const k = key as keyof User;
    return JSON.stringify(user[k]) === JSON.stringify(otherUser[k]);
  });
}

type Props = {
  officers?: User[];
};

export default function useGraphData({ officers }: Props) {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { colors } = useTheme();

  async function updateOrgData() {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const [orgJwt, userJwt] = await Promise.all([
      currentUser.createAuthToken({ scope: '*' }),
      currentUser.createAuthToken({ scope: '*' }),
    ]);
    const { e2eDecrypt, id } = currentUser;
    const [
      { errorMessage: orgErrorMessage, org },
      { errorMessage: userErrorMessage, user },
    ] = await Promise.all([
      fetchOrg({ e2eDecrypt, jwt: orgJwt }),
      getUser({ id, jwt: userJwt }),
    ]);

    const shouldThrow = orgErrorMessage !== undefined
      || org === undefined
      || userErrorMessage !== undefined
      || user === undefined;
    if (shouldThrow) {
      const errorMessage = orgErrorMessage ?? userErrorMessage;
      throw new Error(errorMessage ?? GENERIC_ERROR_MESSAGE);
    }

    const changed = userChanged(currentUser.user(), user)
      || orgChanged(currentUser.org, org);
    if (changed) {
      const updatedCurrentUser = { ...currentUser, ...user };
      updatedCurrentUser.org = org;
      setCurrentUser(updatedCurrentUser);
    }
  }

  const graphData = currentUser?.org?.graph;

  const officerMap = useMemo(() => {
    if (officers === undefined) { return undefined; }
    return Object.fromEntries(officers.map((o) => [o.id, o.offices]));
  }, [officers]);

  const visGraphData = useMemo(
    () => toVisNetworkData(colors, officerMap, currentUser?.id, graphData),
    [colors, currentUser?.id, graphData, officerMap],
  );

  const nodeCount = Object.keys(graphData?.users ?? {}).length;
  const hasMultipleNodes = nodeCount > 1;

  return {
    graphData, hasMultipleNodes, updateOrgData, visGraphData,
  } as const;
}
