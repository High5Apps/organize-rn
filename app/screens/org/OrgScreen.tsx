import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  NotableUserList, OrgGraph, ScreenBackground, SectionHeader, useHeaderButton,
} from '../../components';
import type { OrgScreenProps } from '../../navigation';
import {
  getErrorMessage, useCurrentUser, useOrg, useOrgGraph, useSelectedUser,
  useUsers, useVisGraphData,
} from '../../model';
import { useTranslation } from '../../i18n';

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
  const { refreshOrg } = useOrg();
  const { orgGraph, refreshOrgGraph, hasMultipleNodes } = useOrgGraph();
  const { selectedUser, setSelectedUserId } = useSelectedUser(orgGraph);
  const { options, visGraphData } = useVisGraphData({
    officers: officersReady ? officers : undefined, orgGraph,
  });

  const onRefresh = useCallback(async () => {
    setSelectedUserId(undefined);
    await Promise.all([
      currentUser?.refresh().catch(console.error),
      fetchOfficers().catch(console.error),
      refreshOrg().catch(console.error),
      refreshOrgGraph().catch((error) => {
        const errorMessage = getErrorMessage(error);
        setGraphError(errorMessage);
      }),
    ]);
  }, [fetchOfficers, refreshOrg, refreshOrgGraph]);

  useEffect(() => { onRefresh(); }, []);

  useEffect(() => {
    setSelectedUserId(route.params?.selectedUserId);
  }, [route.params?.selectedUserId]);

  const { t } = useTranslation();
  const ListHeaderComponent = useMemo(() => (
    <>
      <SectionHeader>{t('object.membersAndConnections')}</SectionHeader>
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
  ), [hasMultipleNodes, graphError, selectedUser?.id, visGraphData, t]);

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
