import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, { VisNetworkRef } from 'react-native-vis-network';
import { isCurrentUserData, useGraphData, useUserContext } from '../../model';
import useTheme from '../../Theme';
import ErrorMessage from './ErrorMessage';
import ProgressBar from './ProgressBar';

const GRAPH_LOAD_ERROR_MESSAGE = 'Failed to load graph';

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

  const { currentUser } = useUserContext();

  const { colors, styles } = useStyles();
  const { primary } = colors;

  const visNetworkRef = useRef<VisNetworkRef>(null);

  const { updateGraphData, visGraphData } = useGraphData();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    updateGraphData().catch((e) => {
      console.error(e);
      if (subscribed) {
        setError(GRAPH_LOAD_ERROR_MESSAGE);
      }
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
  if (visGraphData) {
    component = (
      <VisNetwork
        style={{ backgroundColor: 'transparent' }}
        containerStyle={{ backgroundColor: colors.fill }}
        data={visGraphData}
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
