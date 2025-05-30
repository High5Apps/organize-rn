import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import {
  Modal, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../Theme';
import { LockingScrollView, Scrim } from '../../views';
import { IconButton } from '../buttons';

const useStyles = () => {
  const {
    colors, font, spacing, sizes,
  } = useTheme();

  const { height: screenHeight } = useWindowDimensions();

  const styles = StyleSheet.create({
    body: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      marginHorizontal: spacing.m,
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      right: 0,
      top: 0,
    },
    container: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
      borderWidth: spacing.s,
      paddingVertical: spacing.m,
      margin: spacing.m,
      maxHeight: screenHeight - 2 * spacing.m,
    },
    headline: {
      color: colors.label,
      fontFamily: font.weights.semiBold,
      fontSize: font.sizes.body,
      margin: spacing.m,
      textAlign: 'center',
    },
    icon: {
      alignSelf: 'center',
      color: colors.primary,
      fontSize: sizes.largeIcon,
    },
    scrim: {
      justifyContent: 'center',
    },
  });

  return { styles };
};

export type StaticProps = {
  body?: string;
  headline: string;
  iconName: string;
};

type Props = StaticProps & {
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
};

export default function LearnMoreModal({
  body, children, headline, iconName, setVisible, visible,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
      statusBarTranslucent
    >
      <Scrim onPress={() => setVisible(false)} style={styles.scrim}>
        <View style={styles.container}>
          <IconButton
            iconName="close"
            iconSize="large"
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          />
          <Icon name={iconName} style={styles.icon} />
          <Text style={styles.headline}>{headline}</Text>
          <LockingScrollView>
            <View onStartShouldSetResponder={() => true}>
              {children ?? <Text style={styles.body}>{body}</Text>}
            </View>
          </LockingScrollView>
        </View>
      </Scrim>
    </Modal>
  );
}
