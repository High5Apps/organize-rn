import React, { useEffect, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import VisNetwork, { Data } from 'react-native-vis-network';
import { isCurrentUserData, useUserContext } from '../../model';
import {
  ErrorResponse, fetchOrgGraph, isErrorResponse,
} from '../../networking';
import useTheme from '../../Theme';

type Props = {
  containerStyle?: ViewStyle;
};

export default function OrgGraph({ containerStyle }: Props) {
  const [data, setData] = useState<Data>({ edges: [], nodes: [] });
  const { colors: { primary } } = useTheme();

  const { currentUser, setCurrentUser } = useUserContext();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    async function updateOrgGraph() {
      if (!isCurrentUserData(currentUser)) {
        throw new Error('Expected currentUser to be set');
      }
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { orgId } = currentUser;
      const responseOrError = await fetchOrgGraph({ jwt, orgId });
      if (!subscribed) { return; }

      if (isErrorResponse(responseOrError)) {
        const { errorMessage } = ErrorResponse(responseOrError);
        throw new Error(errorMessage);
      }

      const orgGraph = responseOrError;
      currentUser.org.graph = orgGraph;

      setData({
        nodes: orgGraph.userIds.map((id) => ({ id })) || [],
        edges: orgGraph.connections.map(([from, to]) => ({ from, to })),
      });

      setCurrentUser(currentUser);
    }
    updateOrgGraph().catch(console.error);

    return unsubscribe;
  }, []);

  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

  const { id: orgId } = currentUser.org;

  const options = {
    edges: {
      color: primary,
      width: 2,
    },
    interaction: {
      dragNodes: false,
      dragView: false,
      keyboard: false,
      selectable: false,
      zoomView: false,
    },
    layout: {
      randomSeed: orgId,
    },
    nodes: {
      color: primary,
    },
  };

  return (
    <View style={containerStyle}>
      <VisNetwork data={data} options={options} />
    </View>
  );
}

OrgGraph.defaultProps = {
  containerStyle: {},
};
