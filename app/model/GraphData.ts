import { useMemo } from 'react';
import { Data } from 'react-native-vis-network';
import useTheme, { ThemeColors } from '../Theme';
import { fetchOrg } from '../networking';
import { useUserContext } from './UserContext';
import { Org, OrgGraph as OrgGraphType, isCurrentUserData } from './types';
import getCircleColors from './OrgScreenCircleColors';

function toVisNetworkData(
  colors: ThemeColors,
  currentUserId?: string,
  orgGraph?: OrgGraphType,
): Data | undefined {
  if (!orgGraph) { return undefined; }

  return {
    nodes: Object.keys(orgGraph.users).map((id) => {
      const user = orgGraph.users[id];
      const isMe = (id === currentUserId);
      const {
        circleBorderColor, circleBackgroundColor, shadow,
      } = getCircleColors({ colors, isMe, offices: user.offices });
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

export default function useGraphData() {
  const { currentUser, setCurrentUser } = useUserContext();
  const { colors } = useTheme();

  async function updateOrgData() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }
    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecrypt } = currentUser;
    const { errorMessage, org } = await fetchOrg({ e2eDecrypt, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (orgChanged(currentUser.org, org)) {
      const updatedCurrentUser = { ...currentUser };
      updatedCurrentUser.org = org;
      setCurrentUser(updatedCurrentUser);
    }
  }

  const graphData = currentUser?.org?.graph;

  const visGraphData = useMemo(
    () => toVisNetworkData(colors, currentUser?.id, graphData),
    [colors, currentUser?.id, graphData],
  );

  const nodeCount = Object.keys(graphData?.users ?? {}).length;
  const hasMultipleNodes = nodeCount > 1;

  return {
    graphData, hasMultipleNodes, updateOrgData, visGraphData,
  } as const;
}
