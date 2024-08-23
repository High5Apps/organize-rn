import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  NotableUserList, OrgGraph, ScreenBackground, SectionHeader, useHeaderButton,
} from '../../components';
import type { OrgScreenProps } from '../../navigation';
import {
  getErrorMessage, useCurrentUser, useOrg, useSelectedUser, useUsers,
  useVisGraphData,
} from '../../model';

export default function OrgScreen({ navigation, route }: OrgScreenProps) {
  const [graphError, setGraphError] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [graphRendered, setGraphRendered] = useState(false);

  useHeaderButton({
    iconName: 'settings',
    navigation,
    onPress: useCallback(() => navigation.navigate('Settings'), [navigation]),
  });

  const { currentUser } = useCurrentUser();
  const {
    users: officers, fetchFirstPageOfUsers: fetchOfficers, ready: officersReady,
  } = useUsers({ filter: 'officer', sort: 'office' });
  const {
    hasMultipleNodes, orgGraph, refreshOrg,
  } = useOrg();
  const { selectedUser, setSelectedUserId } = useSelectedUser(orgGraph);
  const { options, visGraphData } = useVisGraphData({
    officers: officersReady ? officers : undefined, orgGraph,
  });

  const onRefresh = useCallback(async () => {
    setSelectedUserId(undefined);
    await Promise.all([
      currentUser?.refresh().catch(console.error),
      fetchOfficers().catch(console.error),
      refreshOrg().catch((error) => {
        const errorMessage = getErrorMessage(error);
        setGraphError(errorMessage);
      }),
    ]);
  }, [fetchOfficers, refreshOrg]);

  useEffect(() => { onRefresh(); }, []);

  useEffect(() => {
    setSelectedUserId(route.params?.selectedUserId);
  }, [route.params?.selectedUserId]);

  const ListHeaderComponent = useMemo(() => (
    <>
      <SectionHeader>Members and connections</SectionHeader>
      <OrgGraph
        hasMultipleNodes={hasMultipleNodes}
        error={graphError}
        onInteraction={(inProgress: boolean) => setScrollEnabled(!inProgress)}
        onRenderingProgressChanged={
          (progress) => setGraphRendered(progress >= 1)
        }
        options={options}
        selectedUserId={selectedUser?.id}
        setSelectedUserId={setSelectedUserId}
        visGraphData={visGraphData}
      />
    </>
  ), [hasMultipleNodes, graphError, selectedUser?.id, visGraphData]);

  return (
    <ScreenBackground>
      <NotableUserList
        disableRows={!graphRendered}
        ListHeaderComponent={ListHeaderComponent}
        officers={officers}
        onRefresh={onRefresh}
        scrollEnabled={scrollEnabled}
        selectedUser={selectedUser}
        setSelectedUserId={setSelectedUserId}
      />
    </ScreenBackground>
  );
}
