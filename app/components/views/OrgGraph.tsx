import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, { Data } from 'react-native-vis-network';
import {
  OrgGraph as OrgGraphType, isCurrentUserData, useUserContext,
} from '../../model';
import {
  ErrorResponse, fetchOrgGraph, isErrorResponse,
} from '../../networking';
import useTheme from '../../Theme';
import ErrorMessage from './ErrorMessage';

const GRAPH_LOAD_ERROR_MESSAGE = 'Failed to load graph';

function toVisNetworkData(orgGraph?: OrgGraphType): Data | undefined {
  if (!orgGraph) { return undefined; }

  return {
    nodes: orgGraph.users,
    edges: orgGraph.connections.map(([from, to]) => ({ from, to })),
  };
}

const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      aspectRatio: 1,
      justifyContent: 'center',
    },
  });

  return { colors, styles };
};

export default function OrgGraph() {
  const [error, setError] = useState('');

  const { colors: { primary } } = useTheme();

  const { currentUser, setCurrentUser } = useUserContext();

  const { colors, styles } = useStyles();

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
      const updatedCurrentUser = { ...currentUser };
      updatedCurrentUser.org.graph = orgGraph;
      setCurrentUser(updatedCurrentUser);
    }
    updateOrgGraph().catch((e) => {
      console.error(e);
      setError(GRAPH_LOAD_ERROR_MESSAGE);
    });

    return unsubscribe;
  }, []);

  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

  const data = toVisNetworkData(currentUser?.org?.graph);

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
      randomSeed: currentUser.org.id,
    },
    nodes: {
      color: primary,
    },
  };

  let component;
  if (data) {
    component = (
      <VisNetwork
        style={{ backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: colors.fill }}
        data={data}
        options={options}
      />
    );
  } else if (error) {
    component = <ErrorMessage message={error} />;
  } else {
    component = <ActivityIndicator color={primary} />;
  }

  return (
    <View style={styles.container}>
      { component }
    </View>
  );
}
