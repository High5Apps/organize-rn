import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, { Data, VisNetworkRef } from 'react-native-vis-network';
import {
  OrgGraph as OrgGraphType, getCircleColors, isCurrentUserData, useUserContext,
} from '../../model';
import {
  ErrorResponse, fetchOrgGraph, isErrorResponse,
} from '../../networking';
import useTheme, { ThemeColors } from '../../Theme';
import ErrorMessage from './ErrorMessage';
import ProgressBar from './ProgressBar';

const GRAPH_LOAD_ERROR_MESSAGE = 'Failed to load graph';

function toVisNetworkData(
  colors: ThemeColors,
  currentUserId: string,
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

type Props = {
  onInteraction?: (inProgress: boolean) => void;
};

export default function OrgGraph({ onInteraction }: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { currentUser, setCurrentUser } = useUserContext();

  const { colors, styles } = useStyles();
  const { primary } = colors;

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

  const data = toVisNetworkData(colors, currentUser.id, currentUser.org.graph);

  const options = {
    edges: {
      color: primary,
      width: 2,
    },
    interaction: {
      dragNodes: false,
      keyboard: false,
      selectable: false,
    },
    layout: {
      randomSeed: currentUser.org.id,
    },
    nodes: {
      borderWidth: 4,
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
        onResponderGrant={() => onInteraction?.(true)}
        onResponderRelease={() => onInteraction?.(false)}
        onResponderTerminate={() => onInteraction?.(false)}
        onStartShouldSetResponder={() => true}
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

OrgGraph.defaultProps = {
  onInteraction: () => {},
};
