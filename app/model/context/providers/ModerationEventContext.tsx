import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { ModerationEvent } from '../../types';
import useModelCache from '../../ModelCache';

type RequiredModerationEvent = Required<ModerationEvent>;

type ModerationEventContextType = {
  cacheModerationEvent: (moderationEvent: RequiredModerationEvent) => void;
  cacheModerationEvents: (moderationEvents?: RequiredModerationEvent[]) => void;
  getCachedModerationEvent: (moderationEventId?: string) => RequiredModerationEvent | undefined;
};

const ModerationEventContext = createContext<ModerationEventContextType>({
  cacheModerationEvent: () => {},
  cacheModerationEvents: () => {},
  getCachedModerationEvent: () => undefined,
});

export function ModerationEventContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheModerationEvent,
    cacheModels: cacheModerationEvents,
    getCachedModel: getCachedModerationEvent,
  } = useModelCache<RequiredModerationEvent>();

  const moderationEventContext = useMemo<ModerationEventContextType>(() => ({
    cacheModerationEvent, cacheModerationEvents, getCachedModerationEvent,
  }), [cacheModerationEvent, cacheModerationEvents, getCachedModerationEvent]);

  return (
    <ModerationEventContext.Provider value={moderationEventContext}>
      {children}
    </ModerationEventContext.Provider>
  );
}

export const useModerationEventContext = () => useContext(ModerationEventContext);
