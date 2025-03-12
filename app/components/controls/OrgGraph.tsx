import React, {
  Dispatch, SetStateAction, useEffect, useMemo, useRef, useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import VisNetwork, {
  Data, Options, VisNetworkRef,
} from 'react-native-vis-network';
import useTheme from '../../Theme';
import { ErrorMessage, useOrgGraphProgressBar } from '../views';
import { useOrgGraphClickHandler } from './handlers';

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
  options: Options;
  selectedUserId?: string;
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>;
  visGraphData?: Data;
};

export default function OrgGraph({
  hasMultipleNodes, error, onInteraction = () => {},
  onRenderingProgressChanged = () => {}, options, selectedUserId,
  setSelectedUserId, visGraphData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const { colors, styles } = useStyles();
  const { primary } = colors;

  const visNetworkRef = useRef<VisNetworkRef>(null);

  const { clickHandler } = useOrgGraphClickHandler(
    loading,
    visNetworkRef,
    hasMultipleNodes,
    setSelectedUserId,
  );

  useEffect(() => {
    clickHandler({ userId: selectedUserId });
  }, [selectedUserId]);

  const {
    OrgGraphProgressBar, progress,
  } = useOrgGraphProgressBar(loading, visNetworkRef);

  useEffect(() => {
    onRenderingProgressChanged?.(progress);
  }, [progress]);

  const Component = useMemo(() => {
    if (visGraphData) {
      return (
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
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    return <ActivityIndicator color={primary} />;
  }, [hasMultipleNodes, error, visGraphData]);

  return (
    <View style={styles.container}>
      { OrgGraphProgressBar }
      { Component }
    </View>
  );
}
