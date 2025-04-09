import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  PrimaryButton, ScreenBackground, TextButton, useHeaderButton, WorkGroupList,
} from '../../components';
import useTheme from '../../Theme';
import type { SelectWorkGroupScreenProps } from '../../navigation';

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

export default function SelectWorkGroupScreen({
  navigation,
}: SelectWorkGroupScreenProps) {
  const [listReady, setListReady] = useState(false);

  const { styles } = useStyles();

  const onAddWorkGroupPress = useCallback(() => (
    navigation.navigate('NewWorkGroup')
  ), [navigation]);

  useHeaderButton({
    disabled: !listReady,
    iconName: 'add',
    navigation,
    onPress: onAddWorkGroupPress,
  });

  const ListFooterComponent = useMemo(() => (
    <View style={styles.listFooterComponent}>
      <Text style={styles.text}>Don&apos;t see your work group?</Text>
      <TextButton onPress={onAddWorkGroupPress}>Add your work group</TextButton>
    </View>
  ), [onAddWorkGroupPress]);

  return (
    <ScreenBackground>
      <WorkGroupList
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponent={ListFooterComponent}
        onEditWorkGroupPress={(wg) => console.log(`edit ${JSON.stringify(wg)}`)}
        onReadyChanged={setListReady}
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
