import { useMemo } from 'react';
import { Data } from 'react-native-vis-network';
import useTheme, { ThemeColors } from '../Theme';
import { ErrorResponse, fetchOrgGraph, isErrorResponse } from '../networking';
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
        color: { background: circleBackgroundColor, border: circleBorderColor },
        id,
        shadow,
      };
    }),
    edges: orgGraph.connections.map(([from, to]) => ({ from, to })),
  };
}

export default function useGraphData() {
  const { currentUser, setCurrentUser } = useUserContext();
  const { colors } = useTheme();

  async function updateGraphData() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }
    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { orgId } = currentUser;
    const responseOrError = await fetchOrgGraph({ jwt, orgId });

    if (isErrorResponse(responseOrError)) {
      const { errorMessage } = ErrorResponse(responseOrError);
      throw new Error(errorMessage);
    }

    const orgGraph = responseOrError;
    const updatedCurrentUser = { ...currentUser };
    updatedCurrentUser.org.graph = orgGraph;
    setCurrentUser(updatedCurrentUser);
  }

  const graphData = currentUser?.org?.graph;

  const visGraphData = useMemo(
    () => toVisNetworkData(colors, currentUser?.id, graphData),
    [colors, currentUser?.id, graphData],
  );

  return { graphData, updateGraphData, visGraphData } as const;
}
