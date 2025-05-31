import React from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getShiftName, isDefined, WorkGroup } from '../../../../model';
import useTheme from '../../../../Theme';
import { IconButton } from '../../buttons';
import { DisclosureIcon } from '../../../views';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      columnGap: spacing.m,
      flexDirection: 'row',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
    disclosureIcon: {
      alignSelf: 'flex-start',
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.mediumIcon,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textContainer: {
      flex: 1,
    },
    textSecondary: {
      color: colors.labelSecondary,
    },
  });

  return { colors, styles };
};

type Props = {
  editable?: boolean;
  item: WorkGroup;
  onEditPress?: (item: WorkGroup) => void;
  onPress?: (item: WorkGroup) => void;
  selectable?: boolean;
  selected?: boolean;
  showDisclosureIcon?: boolean;
};

export default function WorkGroupRow({
  editable, item, onEditPress, onPress, selectable, selected,
  showDisclosureIcon,
}: Props) {
  const {
    department, jobTitle, memberCount, shift,
  } = item;

  const { colors, styles } = useStyles();
  const { t } = useTranslation();

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        {selectable && (
          <Icon
            name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{jobTitle}</Text>
          <Text style={[styles.text, styles.textSecondary]}>
            {[getShiftName(shift), department].filter(isDefined).join(', ')}
          </Text>
          <Text style={[styles.text, styles.textSecondary]}>
            {t('hint.memberCount', { count: memberCount })}
          </Text>
        </View>
        {editable && (
          <IconButton
            iconName="edit"
            iconSize="medium"
            onPress={() => onEditPress?.(item)}
          />
        )}
        {showDisclosureIcon && <DisclosureIcon style={styles.disclosureIcon} />}
      </View>
    </TouchableHighlight>
  );
}
