import { useMemo } from 'react';
import { Data, Options } from 'react-native-vis-network';
import useTheme from '../Theme';
import { OrgGraph, User } from './types';
import getCircleColors from './OrgScreenCircleColors';
import useCurrentUser from './CurrentUser';

type Props = {
  officers?: User[];
  orgGraph?: OrgGraph;
};

export default function useVisGraphData({ officers, orgGraph }: Props) {
  const officerMap = useMemo(() => {
    if (officers === undefined) { return undefined; }
    return Object.fromEntries(officers.map((o) => [o.id, o.offices]));
  }, [officers]);
  const { colors } = useTheme();
  const { currentUser } = useCurrentUser();

  if (!currentUser) { throw new Error('Expected current user'); }

  const options: Options = useMemo(() => ({
    edges: {
      color: colors.primary,
      width: 2,
    },
    interaction: {
      dragNodes: false,
      keyboard: false,
    },
    layout: {
      randomSeed: currentUser.org.id,
    },
    nodes: {
      borderWidth: 4,
    },
  }), [colors.primary, currentUser.org.id]);

  const visGraphData: Data | undefined = useMemo(() => {
    if (orgGraph === undefined || officerMap === undefined) {
      return undefined;
    }

    return {
      nodes: orgGraph.userIds.map((id) => {
        const offices = officerMap[id] ?? [];
        const isMe = (id === currentUser?.id);
        const {
          circleBorderColor, circleBackgroundColor, shadow,
        } = getCircleColors({ colors, isMe, offices });
        return {
          chosen: false,
          color: {
            background: circleBackgroundColor,
            border: circleBorderColor,
          },
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
  }, [colors, currentUser?.id, orgGraph, officerMap]);

  return { options, visGraphData };
}
