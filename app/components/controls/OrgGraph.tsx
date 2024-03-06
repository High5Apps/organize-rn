import React, {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, { Data, VisNetworkRef } from 'react-native-vis-network';
import { useCurrentUser } from '../../model';
import useTheme from '../../Theme';
import { ErrorMessage, ProgressBar } from '../views';
import { useClickHandler, useOrgGraphProgress } from '../hooks';

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
  hasMultipleNodes: boolean;
  error: string;
  onInteraction?: (inProgress: boolean) => void;
  onRenderingProgressChanged?: (progress: number) => void;
  selectedUserId?: string;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
  visGraphData?: Data;
};

export default function OrgGraph({
  hasMultipleNodes, error, onInteraction, onRenderingProgressChanged,
  selectedUserId, setSelectedUserId, visGraphData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const { currentUser } = useCurrentUser();

  const { colors, styles } = useStyles();
  const { primary } = colors;

  const visNetworkRef = useRef<VisNetworkRef>(null);

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

  const progress = useOrgGraphProgress(loading, visNetworkRef);
  useEffect(() => {
    onRenderingProgressChanged?.(progress);
  }, [progress]);

  if (!currentUser) { throw new Error('Expected currentUser'); }

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
      <ProgressBar progress={progress} />
      { component }
    </View>
  );
}

OrgGraph.defaultProps = {
  onInteraction: () => {},
  onRenderingProgressChanged: () => {},
  selectedUserId: undefined,
  visGraphData: undefined,
};
