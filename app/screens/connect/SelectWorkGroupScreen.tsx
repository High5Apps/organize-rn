import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  PrimaryButton, ScreenBackground, TextButton, useHeaderButton, WorkGroupList,
} from '../../components';
import useTheme from '../../Theme';
import type { SelectWorkGroupScreenProps } from '../../navigation';
import { useUnionCard, useWorkGroups } from '../../model';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    contentContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
    listFooterComponent: {
      alignItems: 'center',
      padding: spacing.m,
      rowGap: spacing.s,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

function useShouldDisableAddButtons() {
  const [addedLocalWorkGroup, setAddedLocalWorkGroup] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [listReady, setListReady] = useState(false);

  const { unionCard } = useUnionCard();
  const { getCachedWorkGroup } = useWorkGroups();

  useEffect(() => {
    // Reset on pull-to-refresh to prevent a situation where Add buttons are
    // disabled and no row is editable. Without this reset, this could have
    // happened if a user added a new work group, tapped Edit to navigate to
    // this screen, selected a different work group, then did a pull to refresh.
    if (listLoading) {
      setAddedLocalWorkGroup(false);
      return;
    }

    const workGroup = getCachedWorkGroup(unionCard?.workGroupId);
    if (workGroup?.isLocalOnly) {
      setAddedLocalWorkGroup(true);
    }
  }, [getCachedWorkGroup, listLoading, unionCard?.workGroupId]);

  return {
    setListLoading,
    setListReady,
    shouldDisableAddButtons: !listReady || listLoading || addedLocalWorkGroup,
  };
}

export default function SelectWorkGroupScreen({
  navigation,
}: SelectWorkGroupScreenProps) {
  const { styles } = useStyles();

  const navigateToNewWorkGroup = useCallback(() => (
    navigation.navigate('NewWorkGroup')
  ), [navigation]);

  const {
    setListLoading, setListReady, shouldDisableAddButtons,
  } = useShouldDisableAddButtons();

  useHeaderButton({
    disabled: shouldDisableAddButtons,
    iconName: 'add',
    navigation,
    onPress: navigateToNewWorkGroup,
  });

  const ListFooterComponent = useMemo(() => (
    <View style={styles.listFooterComponent}>
      <Text style={styles.text}>Don&apos;t see your work group?</Text>
      <TextButton onPress={navigateToNewWorkGroup}>
        Add your work group
      </TextButton>
    </View>
  ), [navigateToNewWorkGroup]);

  return (
    <ScreenBackground>
      <WorkGroupList
        contentContainerStyle={styles.contentContainerStyle}
        includeLocalOnlyWorkGroups
        ListFooterComponent={
          shouldDisableAddButtons ? undefined : ListFooterComponent
        }
        onEditWorkGroupPress={navigateToNewWorkGroup}
        onReadyChanged={setListReady}
        onLoadingChanged={setListLoading}
        selectionEnabled
      />
      <PrimaryButton
        iconName="done"
        label="Done"
        onPress={navigation.goBack}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
