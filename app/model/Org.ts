import { useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Data } from 'react-native-vis-network';
import useTheme, { ThemeColors } from '../Theme';
import { fetchOrg } from '../networking';
import {
  Office, Org, OrgGraph, OrgGraph as OrgGraphType, User,
} from './types';
import getCircleColors from './OrgScreenCircleColors';
import useCurrentUser from './CurrentUser';

function toVisNetworkData(
  colors: ThemeColors,
  officerMap?: { [key: string]: Office[] },
  currentUserId?: string,
  orgGraph?: OrgGraphType,
): Data | undefined {
  if (orgGraph === undefined || officerMap === undefined) { return undefined; }

  return {
    nodes: orgGraph.userIds.map((id) => {
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

type Props = {
  officers?: User[];
};

export default function useOrg({ officers }: Props) {
  const [org, setOrg] = useState<Org>();
  const [orgGraph, setOrgGraph] = useState<OrgGraph>();

  const { currentUser, setCurrentUser } = useCurrentUser();
  const { colors } = useTheme();

  async function updateOrg() {
    if (!currentUser) { throw new Error('Expected currentUser to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecrypt } = currentUser;
    const {
      errorMessage, org: fetchedOrg, orgGraph: fetchedOrgGraph,
    } = await fetchOrg({ e2eDecrypt, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    if (!isEqual(orgGraph, fetchedOrgGraph)) {
      setOrgGraph(fetchedOrgGraph);
    }

    if (!isEqual(org, fetchedOrg)) {
      setOrg(fetchedOrg);
      setCurrentUser({ ...currentUser, org: fetchedOrg });
    }
  }

  const officerMap = useMemo(() => {
    if (officers === undefined) { return undefined; }
    return Object.fromEntries(officers.map((o) => [o.id, o.offices]));
  }, [officers]);

  const visGraphData = useMemo(
    () => toVisNetworkData(colors, officerMap, currentUser?.id, orgGraph),
    [colors, currentUser?.id, orgGraph, officerMap],
  );

  const nodeCount = (orgGraph?.userIds ?? []).length;
  const hasMultipleNodes = nodeCount > 1;

  return {
    org, orgGraph, hasMultipleNodes, updateOrg, visGraphData,
  };
}
