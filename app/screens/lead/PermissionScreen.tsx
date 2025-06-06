import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { PermissionScreenProps } from '../../navigation';
import {
  HeaderText, OfficePermissionList, ScreenBackground,
} from '../../components';
import useTheme from '../../Theme';
import { usePermissionItems } from '../../model';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    headerText: {
      padding: spacing.m,
    },
  });

  return { styles };
};

export default function PermissionScreen({ route }: PermissionScreenProps) {
  const { scope } = route.params;

  const { styles } = useStyles();
  const { t } = useTranslation();

  const { findByScope } = usePermissionItems();
  const permissionItem = findByScope(scope);
  const maybePermission = permissionItem?.title?.toLocaleLowerCase();
  const question = maybePermission
    ? t('question.permission.format', { permission: maybePermission })
    : t('question.permission.unknown');

  const ListHeaderComponent = useMemo(() => (
    <HeaderText style={styles.headerText}>{question}</HeaderText>
  ), [question]);

  return (
    <ScreenBackground>
      <OfficePermissionList
        ListHeaderComponent={ListHeaderComponent}
        scope={scope}
      />
    </ScreenBackground>
  );
}
