import React, { RefObject, useEffect, useState } from 'react';
import { VisNetworkRef } from 'react-native-vis-network';
import { ProgressBar } from '../views';

export default function useProgress(
  isGraphAvailable: boolean,
  visNetwork: RefObject<VisNetworkRef>,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGraphAvailable || !visNetwork.current) {
      return () => {};
    }

    const progressSubscription = visNetwork.current.addEventListener(
      'stabilizationProgress',
      ({ iterations, total }: any) => setProgress(iterations / total),
    );

    const doneSubscription = visNetwork.current.addEventListener(
      'stabilizationIterationsDone',
      () => setProgress(1),
    );

    return () => {
      progressSubscription.remove();
      doneSubscription.remove();
    };
  }, [isGraphAvailable]);

  return <ProgressBar progress={progress} />;
}
