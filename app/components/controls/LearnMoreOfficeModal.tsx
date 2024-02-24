import React, { useCallback, useMemo, useState } from 'react';
import { OFFICE_DUTIES, OfficeCategory, addMetadata } from '../../model';
import LearnMoreModal from './LearnMoreModal';
import { BulletedText } from '../views';

type Props = {
  officeCategory: OfficeCategory;
};

export default function useLearnMoreOfficeModal({ officeCategory }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const duties = OFFICE_DUTIES[officeCategory];
  const office = useMemo(
    () => addMetadata({ type: officeCategory, open: true }),
    [officeCategory],
  );

  const LearnMoreOfficeModal = useCallback(() => (
    <LearnMoreModal
      headline={`What does a ${office.title} do?`}
      iconName={office.iconName}
      setVisible={setModalVisible}
      visible={modalVisible}
    >
      <BulletedText bullets={duties} />
    </LearnMoreModal>
  ), [office, modalVisible]);

  return { LearnMoreOfficeModal, office, setModalVisible };
}
