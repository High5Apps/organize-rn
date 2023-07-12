import { RefObject, useEffect } from 'react';
import { Position, VisNetworkRef } from 'react-native-vis-network';

const ANIMATION_OPTIONS = {
  duration: 500,
  easingFunction: 'easeInOutQuad' as const,
};
const FOCUS_OPTIONS = {
  animation: ANIMATION_OPTIONS,
  locked: true,
  scale: 1.5,
};

const MAX_NORMALIZED_FOCUS_DISTANCE = 10000;

function getNearestNodeInfo(
  { x: clickX, y: clickY }: Position,
  nodePositions: { [nodeId: string]: Position },
) {
  let nearestDistance: number | undefined;
  let nearestId: string | undefined;

  Object.keys(nodePositions).forEach((nodeId) => {
    const position = nodePositions[nodeId];
    if (!position) { return; }

    const { x: nodeX, y: nodeY } = position;
    const distance = (nodeX - clickX) ** 2 + (nodeY - clickY) ** 2;
    if (nearestDistance === undefined || distance < nearestDistance) {
      nearestDistance = distance;
      nearestId = nodeId;
    }
  });

  return { nearestDistance, nearestId };
}

export default function useClickHandler(
  isGraphAvailable: boolean,
  visNetwork: RefObject<VisNetworkRef>,
  onUserSelected?: (id?: string) => void,
) {
  useEffect(() => {
    if (!isGraphAvailable || !visNetwork.current) {
      return () => {};
    }

    const clickSubscription = visNetwork.current.addEventListener(
      'click',
      async (event: any) => {
        if (!visNetwork.current) { return; }

        const {
          nodes,
          pointer: { canvas: canvasPointer },
        } = event;

        let userId: string | undefined = nodes[0];
        if (userId) {
          visNetwork.current.focus(userId, FOCUS_OPTIONS);
        } else {
          let positions;
          let scale;
          try {
            [positions, scale] = await Promise.all([
              visNetwork.current.getPositions(),
              visNetwork.current.getScale(),
            ]);
          } catch (e) {
            console.error(e);
          }

          if (positions && scale) {
            const {
              nearestDistance, nearestId,
            } = getNearestNodeInfo(canvasPointer, positions);

            if ((nearestDistance !== undefined) && (nearestId !== undefined)) {
              const normalizedDistance = nearestDistance * scale;
              if (normalizedDistance <= MAX_NORMALIZED_FOCUS_DISTANCE) {
                userId = nearestId;
                visNetwork.current.focus(userId, FOCUS_OPTIONS);
              } else {
                visNetwork.current.fit({
                  animation: ANIMATION_OPTIONS,
                  maxZoomLevel: 100,
                });
              }
            }
          }
        }
        onUserSelected?.(userId);
      },
    );

    return clickSubscription.remove;
  }, [isGraphAvailable, visNetwork.current]);
}
