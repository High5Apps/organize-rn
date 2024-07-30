import React, { useCallback, useMemo, useState } from 'react';
import { OFFICE_DUTIES, OfficeCategory, getOffice } from '../../../model';
import LearnMoreModal from './LearnMoreModal';
import { BulletedText } from '../../views';

type Props = {
  officeCategory: OfficeCategory | null;
};

export default function useLearnMoreOfficeModal({ officeCategory }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const office = useMemo(
    () => {
      if (officeCategory === null) { return null; }
      return getOffice(officeCategory);
    },
    [officeCategory],
  );

  const LearnMoreOfficeModal = useCallback(() => {
    if (office === null) { return null; }

    const duties = OFFICE_DUTIES[office.type];

    return (
      <LearnMoreModal
        headline={`What does a ${office.title} do?`}
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
