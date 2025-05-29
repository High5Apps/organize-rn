import React, { useCallback, useMemo, useState } from 'react';
import { OfficeCategory, getOffice } from '../../../model';
import LearnMoreModal from './LearnMoreModal';
import { BulletedText } from '../../views';
import { useTranslation } from '../../../i18n';

type Props = {
  officeCategory: OfficeCategory | null;
};

export default function useLearnMoreOfficeModal({ officeCategory }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const { t } = useTranslation();

  const office = useMemo(
    () => {
      if (officeCategory === null) { return null; }
      return getOffice(officeCategory);
    },
    [officeCategory],
  );

  const LearnMoreOfficeModal = useCallback(() => {
    if (office === null) { return null; }

    const duties = t(`explanation.officeDuties.${office.type}`, {
      returnObjects: true,
    });

    return (
      <LearnMoreModal
        headline={t('question.officeDuties', { officeTitle: office.title })}
        iconName={office.iconName}
        setVisible={setModalVisible}
        visible={modalVisible}
      >
        <BulletedText bullets={duties} />
      </LearnMoreModal>
    );
  }, [office, modalVisible]);

  return { LearnMoreOfficeModal, office, setModalVisible };
}
