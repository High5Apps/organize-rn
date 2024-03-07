import React, {
  useCallback, useEffect, useLayoutEffect, useMemo, useState,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  IconButton, NotableUserList, OrgGraph, ScreenBackground, SectionHeader,
} from '../../components';
import type {
  OrgScreenProps, SettingsScreenNavigationProp,
} from '../../navigation';
import { useCurrentUser, useGraphData, useUsers } from '../../model';

const GRAPH_LOAD_ERROR_MESSAGE = 'Failed to load graph';

function SettingsButton() {
  const navigation: SettingsScreenNavigationProp = useNavigation();
  return (
    <IconButton
      iconName="settings"
      onPress={() => navigation.navigate('Settings')}
    />
  );
}

export default function OrgScreen({ navigation }: OrgScreenProps) {
  const [graphError, setGraphError] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [graphRendered, setGraphRendered] = useState(false);

  useLayoutEffect(() => {
    const headerRight = () => <SettingsButton />;
    navigation.setOptions({ headerRight });
  }, [navigation]);

  const { currentUser } = useCurrentUser();
  const {
    users: officers, fetchFirstPageOfUsers: fetchOfficers, ready,
  } = useUsers({ filter: 'officer', sort: 'office' });
  const {
    hasMultipleNodes, graphData, updateOrgData, visGraphData,
  } = useGraphData({ officers: ready ? officers : undefined });

  const onRefresh = useCallback(async () => {
    setSelectedUserId(undefined);
    await Promise.all([
      currentUser?.update().catch(console.error),
      fetchOfficers().catch(console.error),
      updateOrgData().catch((e) => {
        console.error(e);
        setGraphError(GRAPH_LOAD_ERROR_MESSAGE);
      }),
    ]);
  }, [fetchOfficers, updateOrgData]);

  useEffect(() => { onRefresh(); }, []);

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
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        visGraphData={visGraphData}
      />
    </>
  ), [hasMultipleNodes, graphError, selectedUserId, visGraphData]);

  return (
    <ScreenBackground>
      <NotableUserList
        disableRows={!graphRendered}
        graphData={graphData}
        ListHeaderComponent={ListHeaderComponent}
        officers={officers}
        onRefresh={onRefresh}
        scrollEnabled={scrollEnabled}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />
    </ScreenBackground>
  );
}
