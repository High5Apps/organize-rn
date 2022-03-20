import React, { Dispatch, SetStateAction } from 'react';
import {
  Modal, Pressable, StyleSheet, Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconButton from './IconButton';
import useTheme from './Theme';

const useStyles = () => {
  const {
    colors, font, spacing, sizes,
  } = useTheme();

  const styles = StyleSheet.create({
    closeButton: {
      position: 'absolute',
      right: 0,
      top: 0,
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.primary,
      borderWidth: spacing.s,
      padding: spacing.m,
      margin: spacing.m,
    },
    headline: {
      color: colors.label,
      fontFamily: font.weights.semiBold,
      fontSize: font.sizes.paragraph,
      marginVertical: spacing.m,
      textAlign: 'center',
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.largeIcon,
    },
    paragraph: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.paragraph,
      textAlign: 'center',
    },
    scrim: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      flex: 1,
      justifyContent: 'center',
    },
  });

  return { styles };
};

export type StaticProps = {
  body: string;
  headline: string;
  iconName: string;
};

type Props = StaticProps & {
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
};

export default function NewOrgModal({
  body, headline, iconName, setVisible, visible,
}: Props) {
  const { styles } = useStyles();
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Pressable
        onPress={() => setVisible(false)}
        style={styles.scrim}
      >
        <Pressable
          // This no-op onPress negates the parent scrim's onPress
          onPress={() => {}}
          style={styles.container}
        >
          <IconButton
            iconName="close"
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          />
          <Icon name={iconName} style={styles.icon} />
          <Text style={styles.headline}>
            {headline}
          </Text>
          <Text style={styles.paragraph}>
            {body}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
