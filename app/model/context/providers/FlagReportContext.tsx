import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { FlagReport } from '../../types';
import { useModelCache } from './caches';

type FlagReportContextType = {
  cacheFlagReport: (flagReport: FlagReport) => void;
  cacheFlagReports: (flagReports?: FlagReport[]) => void;
  clearCachedFlagReports: () => void;
  getCachedFlagReport: (id?: string) => FlagReport | undefined;
};

const FlagReportContext = createContext<FlagReportContextType>({
  cacheFlagReport: () => {},
  cacheFlagReports: () => {},
  clearCachedFlagReports: () => {},
  getCachedFlagReport: () => undefined,
});

export function FlagReportContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheFlagReport,
    cacheModels: cacheFlagReports,
    clearCachedModels: clearCachedFlagReports,
    getCachedModel: getCachedFlagReport,
  } = useModelCache<FlagReport>();

  const flagReportsContext = useMemo<FlagReportContextType>(() => ({
    cacheFlagReport,
    cacheFlagReports,
    clearCachedFlagReports,
    getCachedFlagReport,
  }), [
    cacheFlagReport, cacheFlagReports, clearCachedFlagReports,
    getCachedFlagReport,
  ]);

  return (
    <FlagReportContext.Provider value={flagReportsContext}>
      {children}
    </FlagReportContext.Provider>
  );
}

export const useFlagReportContext = () => useContext(FlagReportContext);
