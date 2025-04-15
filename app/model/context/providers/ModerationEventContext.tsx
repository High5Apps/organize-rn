import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { ModerationEvent } from '../../types';
import { useModelCache } from './caches';

type RequiredModerationEvent = Required<ModerationEvent>;

type ModerationEventContextType = {
  cacheModerationEvent: (moderationEvent: RequiredModerationEvent) => void;
  cacheModerationEvents: (moderationEvents?: RequiredModerationEvent[]) => void;
  clearCachedModerationEvents: () => void;
  getCachedModerationEvent: (moderationEventId?: string) => RequiredModerationEvent | undefined;
};

const ModerationEventContext = createContext<ModerationEventContextType>({
  cacheModerationEvent: () => {},
  cacheModerationEvents: () => {},
  clearCachedModerationEvents: () => {},
  getCachedModerationEvent: () => undefined,
});

export function ModerationEventContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheModerationEvent,
    cacheModels: cacheModerationEvents,
    clearCachedModels: clearCachedModerationEvents,
    getCachedModel: getCachedModerationEvent,
  } = useModelCache<RequiredModerationEvent>();

  const moderationEventContext = useMemo<ModerationEventContextType>(() => ({
    cacheModerationEvent,
    cacheModerationEvents,
    clearCachedModerationEvents,
    getCachedModerationEvent,
  }), [
    cacheModerationEvent, cacheModerationEvents, clearCachedModerationEvents,
    getCachedModerationEvent,
  ]);

  return (
    <ModerationEventContext.Provider value={moderationEventContext}>
      {children}
    </ModerationEventContext.Provider>
  );
}

export const useModerationEventContext = () => useContext(ModerationEventContext);
