import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, { Data, VisNetworkRef } from 'react-native-vis-network';
import {
  OrgGraph as OrgGraphType, getHighestOffice, isCurrentUserData, useUserContext,
} from '../../model';
import {
  ErrorResponse, fetchOrgGraph, isErrorResponse,
} from '../../networking';
import useTheme from '../../Theme';
import ErrorMessage from './ErrorMessage';
import ProgressBar from './ProgressBar';

const GRAPH_LOAD_ERROR_MESSAGE = 'Failed to load graph';

function toVisNetworkData(
  fill: string,
  primary: string,
  officeColors: { [key: string]: string },
  currentUserId: string,
  orgGraph?: OrgGraphType,
): Data | undefined {
  if (!orgGraph) { return undefined; }

  return {
    nodes: Object.keys(orgGraph.users).map((id) => {
      const user = orgGraph.users[id];
      const highestOffice = getHighestOffice(user.offices);

      let color: string | undefined | { background: string; border: string; };
      let shadow = true;

      if (highestOffice) {
        color = officeColors[highestOffice];
      } else if (id === currentUserId) {
        color = {
          background: fill,
          border: primary,
        };
      } else {
        shadow = false;
      }

      return { color, id, shadow };
    }),
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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { colors: { fill, office: officeColors, primary } } = useTheme();

  const { currentUser, setCurrentUser } = useUserContext();

  const { colors, styles } = useStyles();

  const visNetworkRef = useRef<VisNetworkRef>(null);

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

  useEffect(() => {
    if (!loading || !visNetworkRef.current) {
      return () => {};
    }

    const progressSubscription = visNetworkRef.current.addEventListener(
      'stabilizationProgress',
      ({ iterations, total }: any) => setProgress(iterations / total),
    );

    const doneSubscription = visNetworkRef.current.addEventListener(
      'stabilizationIterationsDone',
      () => setProgress(1),
    );

    return () => {
      progressSubscription.remove();
      doneSubscription.remove();
    };
  }, [loading]);

  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

  const data = toVisNetworkData(
    fill,
    primary,
    officeColors,
    currentUser.id,
    currentUser.org.graph,
  );

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
      borderWidth: 4,
      color: {
        border: primary,
        background: primary,
      },
    },
  };

  let component;
  if (data) {
    component = (
      <VisNetwork
        style={{ backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: colors.fill }}
        data={data}
        onLoad={() => setLoading(true)}
        options={options}
        ref={visNetworkRef}
      />
    );
  } else if (error) {
    component = <ErrorMessage message={error} />;
  } else {
    component = <ActivityIndicator color={primary} />;
  }

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      { component }
    </View>
  );
}
