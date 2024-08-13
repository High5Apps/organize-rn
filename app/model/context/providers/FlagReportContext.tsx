import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { FlagReport } from '../../types';
import useModelCache from '../../ModelCache';

type FlagReportContextType = {
  cacheFlagReport: (flagReport: FlagReport) => void;
  cacheFlagReports: (flagReports?: FlagReport[]) => void;
  getCachedFlagReport: (id?: string) => FlagReport | undefined;
};

const FlagReportContext = createContext<FlagReportContextType>({
  cacheFlagReport: () => {},
  cacheFlagReports: () => {},
  getCachedFlagReport: () => undefined,
});

export function FlagReportContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheFlagReport,
    cacheModels: cacheFlagReports,
    getCachedModel: getCachedFlagReport,
  } = useModelCache<FlagReport>();

  const flagReportsContext = useMemo<FlagReportContextType>(() => ({
    cacheFlagReport, cacheFlagReports, getCachedFlagReport,
  }), [cacheFlagReport, cacheFlagReports, getCachedFlagReport]);

  return (
    <FlagReportContext.Provider value={flagReportsContext}>
      {children}
    </FlagReportContext.Provider>
  );
}

export const useFlagReportContext = () => useContext(FlagReportContext);
