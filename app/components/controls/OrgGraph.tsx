import React, {
  Dispatch, ForwardedRef, SetStateAction, forwardRef, useEffect, useRef,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, { VisNetworkRef } from 'react-native-vis-network';
import { isCurrentUserData, useGraphData, useUserContext } from '../../model';
import useTheme from '../../Theme';
import ErrorMessage from '../views/ErrorMessage';
import useClickHandler from './OrgGraphClickHandler';
import useProgress from './OrgGraphProgress';
import useOrgGraphRef, { OrgGraphRef } from './OrgGraphRef';

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
  selectedUserId?: string;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
};

const OrgGraph = forwardRef((
  { onInteraction, selectedUserId, setSelectedUserId }: Props,
  ref: ForwardedRef<OrgGraphRef>,
) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentUser } = useUserContext();

  const { colors, styles } = useStyles();
  const { primary } = colors;

  const visNetworkRef = useRef<VisNetworkRef>(null);

  useOrgGraphRef(ref, visNetworkRef.current);

  const { hasMultipleNodes, updateOrgData, visGraphData } = useGraphData();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    updateOrgData().catch((e) => {
      console.error(e);
      if (subscribed) {
        setError(GRAPH_LOAD_ERROR_MESSAGE);
      }
    });

    return unsubscribe;
  }, []);

  const { clickHandler } = useClickHandler(
    loading,
    visNetworkRef,
    hasMultipleNodes,
    setSelectedUserId,
  );

  useEffect(() => {
    if (selectedUserId) {
      clickHandler({ userId: selectedUserId });
    }
  }, [selectedUserId]);

  const ProgressBar = useProgress(loading, visNetworkRef);

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
        zoomFitOnStabilized={hasMultipleNodes}
      />
    );
  } else if (error) {
    component = <ErrorMessage message={error} />;
  } else {
    component = <ActivityIndicator color={primary} />;
  }

  return (
    <View style={styles.container}>
      { ProgressBar }
      { component }
    </View>
  );
});

OrgGraph.defaultProps = {
  onInteraction: () => {},
  selectedUserId: undefined,
};

export default OrgGraph;
