import { useMemo } from 'react';
import { Data } from 'react-native-vis-network';
import useTheme, { ThemeColors } from '../Theme';
import { ErrorResponse, fetchOrg, isErrorResponse } from '../networking';
import { useUserContext } from './UserContext';
import { OrgGraph as OrgGraphType, isCurrentUserData } from './types';
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
      } = getCircleColors({ colors, isMe, user });
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

export default function useGraphData() {
  const { currentUser, setCurrentUser } = useUserContext();
  const { colors } = useTheme();

  async function updateOrgData() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }
    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const responseOrError = await fetchOrg({ jwt });

    if (isErrorResponse(responseOrError)) {
      const { errorMessage } = ErrorResponse(responseOrError);
      throw new Error(errorMessage);
    }

    const org = responseOrError;
    const updatedCurrentUser = { ...currentUser };
    updatedCurrentUser.org = org;
    setCurrentUser(updatedCurrentUser);
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
