import { useEffect, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Data, Options } from 'react-native-vis-network';
import useTheme from '../Theme';
import { OrgGraph, User } from './types';
import getCircleColors from './OrgScreenCircleColors';
import { useCurrentUser } from './context';

type Props = {
  officers?: User[];
  orgGraph?: OrgGraph;
};

export default function useVisGraphData({ officers, orgGraph }: Props) {
  const [
    debouncedOfficers, setDebouncedOfficers,
  ] = useState<User[] | undefined>(officers);

  const { colors, opacity } = useTheme();
  const { currentUser } = useCurrentUser();

  if (!currentUser) { throw new Error('Expected current user'); }

  useEffect(() => {
    if (!isEqual(debouncedOfficers, officers)) {
      setDebouncedOfficers(officers);
    }
  }, [officers]);

  const options: Options = useMemo(() => {
    const edgeWidth = 2;
    const nodeSize = 15;
    return {
      edges: {
        chosen: { label: false, edge: { width: 3 * edgeWidth } },
        color: colors.primary,
        width: edgeWidth,
      },
      interaction: {
        dragNodes: false,
        keyboard: false,
        selectable: false, // Without this edges become selectable
      },
      layout: {
        randomSeed: currentUser.org.id,
      },
      nodes: {
        borderWidth: 4,
        chosen: { label: false, node: { size: 1.5 * nodeSize } },
        shape: 'dot',
        size: nodeSize,
      },
      physics: { barnesHut: { avoidOverlap: 0.01 } },
    };
  }, [colors.primary, currentUser.org.id]);

  const visGraphData: Data | undefined = useMemo(() => {
    if (orgGraph === undefined || debouncedOfficers === undefined) {
      return undefined;
    }

    const officerMap = Object.fromEntries(
      debouncedOfficers.map((o) => [o.id, o.offices]),
    );

    const dimUserIds = new Set(
      [...orgGraph.blockedUserIds, ...orgGraph.leftOrgUserIds],
    );

    return {
      nodes: orgGraph.userIds.map((id) => {
        const offices = officerMap[id] ?? [];
        const isMe = (id === currentUser?.id);
        const isNodeDim = dimUserIds.has(id);
        const {
          circleBorderColor, circleBackgroundColor, shadow,
        } = getCircleColors({ colors, isMe, offices });
        return {
          color: {
            background: circleBackgroundColor,
            border: circleBorderColor,
          },
          id,
          opacity: isNodeDim ? opacity.blocked : opacity.visible,
          shadow,
        };
      }),
      edges: orgGraph.connections.map(([from, to]) => {
        const isConnectionDim = dimUserIds.has(from) || dimUserIds.has(to);
        return {
          color: {
            opacity: isConnectionDim ? opacity.blocked : opacity.visible,
          },
          from,
          to,
        };
      }),
    };
  }, [colors, currentUser?.id, opacity, orgGraph, debouncedOfficers]);

  return { options, visGraphData };
}
