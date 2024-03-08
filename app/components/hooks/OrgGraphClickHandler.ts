import {
  Dispatch, RefObject, SetStateAction, useEffect, useRef,
} from 'react';
import { Position, VisNetworkRef } from 'react-native-vis-network';

const ANIMATION_OPTIONS = {
  duration: 500,
  easingFunction: 'easeInOutQuad' as const,
};
export const DEFAULT_FOCUS_OPTIONS = {
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

type ClickEvent = {
  nodes: string[];
  pointer: {
    canvas: Position;
  }
};

type ClickHandlerProps = {
  event: ClickEvent;
  userId?: never;
} | {
  event?: never;
  userId?: string;
};

export default function useClickHandler(
  isGraphAvailable: boolean,
  visNetwork: RefObject<VisNetworkRef>,
  hasMultipleNodes: boolean,
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>,
) {
  const isEventInProgressRef = useRef(false);

  async function clickHandler({
    event, userId: maybeUserId,
  }: ClickHandlerProps) {
    // isEventInProgressRef is set to false automatically after any animation
    // ends. But you MUST manually set it to false on any code path below that
    // returns early without animating. Otherwise, the guard condition below
    // will mistakenly prevent any future clickHandler actions.
    if (!visNetwork.current || isEventInProgressRef.current) { return; }
    isEventInProgressRef.current = true;

    let scale = 0;
    try {
      scale = await visNetwork.current.getScale();
    } catch (e) {
      console.error(e);
    }

    if (!scale) {
      isEventInProgressRef.current = false;
      return;
    }

    const focusOptions = {
      ...DEFAULT_FOCUS_OPTIONS,

      // Never zoom out during focus
      scale: Math.max(scale, DEFAULT_FOCUS_OPTIONS.scale),
    };

    if (maybeUserId) {
      const nodeInfo = await visNetwork.current.findNode(maybeUserId);
      const nodeFound = nodeInfo.length > 0;
      if (!nodeFound) {
        isEventInProgressRef.current = false;
        return;
      }

      visNetwork.current.focus(maybeUserId, focusOptions);
      setSelectedUserId(maybeUserId);
      return;
    }

    if (event) {
      const {
        nodes,
        pointer: { canvas: canvasPointer },
      } = event;

      let userId: string | undefined = nodes[0];
      if (userId) {
        visNetwork.current.focus(userId, focusOptions);
        setSelectedUserId(userId);
        return;
      }

      let positions;
      try {
        positions = await visNetwork.current.getPositions();
      } catch (e) {
        console.error(e);
      }

      if (!positions) {
        isEventInProgressRef.current = false;
        return;
      }

      const {
        nearestDistance, nearestId,
      } = getNearestNodeInfo(canvasPointer, positions);

      if (!nearestDistance || !nearestId) {
        isEventInProgressRef.current = false;
        return;
      }

      const normalizedDistance = nearestDistance * scale;
      if (normalizedDistance <= MAX_NORMALIZED_FOCUS_DISTANCE) {
        userId = nearestId;
        visNetwork.current.focus(userId, focusOptions);
        setSelectedUserId(userId);
        return;
      }
    }

    const maxZoomLevel = hasMultipleNodes ? 100 : 1;
    visNetwork.current.fit({
      animation: ANIMATION_OPTIONS,
      maxZoomLevel,
    });
    setSelectedUserId(undefined);
  }

  useEffect(() => {
    if (!isGraphAvailable || !visNetwork.current) {
      return () => {};
    }

    const clickSubscription = visNetwork.current.addEventListener(
      'click',
      (event: ClickEvent) => clickHandler({ event }),
    );

    const animationFinishedSubscription = visNetwork.current.addEventListener(
      'animationFinished',
      () => { isEventInProgressRef.current = false; },
    );

    return () => {
      clickSubscription.remove();
      animationFinishedSubscription.remove();
    };
  }, [isGraphAvailable, visNetwork]);

  return { clickHandler };
}
