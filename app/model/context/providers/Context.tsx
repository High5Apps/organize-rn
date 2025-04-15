import React, { PropsWithChildren } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  CurrentUserDataContextProvider, useCurrentUserDataContext,
} from './CurrentUserDataContext';
import { PostContextProvider, usePostContext } from './PostContext';
import { CommentContextProvider, useCommentContext } from './CommentContext';
import {
  BallotPreviewContextProvider, useBallotPreviewContext,
} from './BallotPreviewContext';
import { UserContextProvider, useUserContext } from './UserContext';
import {
  CachedValueContextProvider, useCachedValueContext,
} from './CachedValueContext';
import { BallotContextProvider, useBallotContext } from './BallotContext';
import {
  MyPermissionContextProvider, useMyPermissionContext,
} from './MyPermissionContext';
import {
  FlagReportContextProvider, useFlagReportContext,
} from './FlagReportContext';
import {
  ModerationEventContextProvider, useModerationEventContext,
} from './ModerationEventContext';
import {
  UnionCardContextProvider, useUnionCardContext,
} from './UnionCardContext';
import {
  useWorkGroupContext, WorkGroupContextProvider,
} from './WorkGroupContext';

export function useResetContext() {
  const { clearCachedBallots } = useBallotContext();
  const { clearCachedBallotPreviews } = useBallotPreviewContext();
  const { clearCachedComments } = useCommentContext();
  const { setCurrentUserData } = useCurrentUserDataContext();
  const { clearCachedFlagReports } = useFlagReportContext();
  const { clearCachedModerationEvents } = useModerationEventContext();
  const { clearCachedMyPermissions } = useMyPermissionContext();
  const { clearCachedPosts } = usePostContext();
  const { clearCachedUnionCard } = useUnionCardContext();
  const { clearCachedUsers } = useUserContext();
  const { clearCachedValues } = useCachedValueContext();
  const { clearCachedWorkGroups } = useWorkGroupContext();

  function resetContext() {
    clearCachedBallots();
    clearCachedBallotPreviews();
    clearCachedComments();
    clearCachedFlagReports();
    clearCachedModerationEvents();
    clearCachedMyPermissions();
    clearCachedPosts();
    clearCachedUnionCard();
    clearCachedUsers();
    clearCachedValues();
    clearCachedWorkGroups();

    // This must happen last
    setCurrentUserData(null);
  }

  return { resetContext };
}

export default function Context({ children }: PropsWithChildren<{}>) {
  return (
    <CurrentUserDataContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <BallotPreviewContextProvider>
            <UserContextProvider>
              <BallotContextProvider>
                <MyPermissionContextProvider>
                  <FlagReportContextProvider>
                    <ModerationEventContextProvider>
                      <UnionCardContextProvider>
                        <WorkGroupContextProvider>
                          <CachedValueContextProvider>
                            <SafeAreaProvider>
                              <KeyboardProvider>
                                {children}
                              </KeyboardProvider>
                            </SafeAreaProvider>
                          </CachedValueContextProvider>
                        </WorkGroupContextProvider>
                      </UnionCardContextProvider>
                    </ModerationEventContextProvider>
                  </FlagReportContextProvider>
                </MyPermissionContextProvider>
              </BallotContextProvider>
            </UserContextProvider>
          </BallotPreviewContextProvider>
        </CommentContextProvider>
      </PostContextProvider>
    </CurrentUserDataContextProvider>
  );
}
