import {
  Dispatch, RefObject, SetStateAction, useEffect, useRef,
} from 'react';
import { Position, VisNetworkRef } from 'react-native-vis-network';
import { NullUser } from '../../../model';

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

export default function useOrgGraphClickHandler(
  isGraphAvailable: boolean,
  visNetwork: RefObject<VisNetworkRef | null>,
  hasMultipleNodes: boolean,
  setSelectedUserId: Dispatch<SetStateAction<string | undefined>>,
) {
  const isEventInProgressRef = useRef(false);

  async function clickHandler({
    event, userId: maybeUserId,
  }: ClickHandlerProps) {
    // Without this, focusing on uncached users sometimes failed due to a race
    // between the network user lookup and the multiple sequential async graph
    // methods below. If the network request completed before the graph calls on
    // the placeholder NullUser completed, the next round of graph calls with
    // the fetched user would fail the event-in-progress check, preventing the
    // graph from focusing on the fetched user.
    if (maybeUserId === NullUser().id) { return; }

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

    function focusOnNode(userId: string) {
      visNetwork.current?.selectNodes([userId], true);
      visNetwork.current?.focus(userId, {
        ...DEFAULT_FOCUS_OPTIONS,

        // Never zoom out during focus
        scale: Math.max(scale, DEFAULT_FOCUS_OPTIONS.scale),
      });
      setSelectedUserId(userId);
    }

    if (maybeUserId) {
      const nodeInfo = await visNetwork.current.findNode(maybeUserId);
      const nodeFound = nodeInfo.length > 0;
      if (!nodeFound) {
        isEventInProgressRef.current = false;
        return;
      }

      focusOnNode(maybeUserId);
      return;
    }

    if (event) {
      // It's not possible to use the first node in the event.nodes array to get
      // the userId because that node is the previously selected node
      const { pointer: { canvas: canvasPointer } } = event;

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
        focusOnNode(nearestId);
        return;
      }
    }

    const maxZoomLevel = hasMultipleNodes ? 100 : 1;
    visNetwork.current.fit({
      animation: ANIMATION_OPTIONS,
      maxZoomLevel,
    });
    visNetwork.current.unselectAll();
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
