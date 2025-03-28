import React, { PropsWithChildren } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CurrentUserDataContextProvider } from './CurrentUserDataContext';
import { PostContextProvider } from './PostContext';
import { CommentContextProvider } from './CommentContext';
import { BallotPreviewContextProvider } from './BallotPreviewContext';
import { UserContextProvider } from './UserContext';
import { CachedValueContextProvider } from './CachedValueContext';
import { BallotContextProvider } from './BallotContext';
import { MyPermissionContextProvider } from './MyPermissionContext';
import { FlagReportContextProvider } from './FlagReportContext';
import { ModerationEventContextProvider } from './ModerationEventContext';
import { UnionCardContextProvider } from './UnionCardContext';

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
                        <CachedValueContextProvider>
                          <SafeAreaProvider>
                            <KeyboardProvider>
                              {children}
                            </KeyboardProvider>
                          </SafeAreaProvider>
                        </CachedValueContextProvider>
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
