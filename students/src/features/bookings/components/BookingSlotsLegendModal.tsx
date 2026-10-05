import { useTranslation } from 'react-i18next';

import { ModalContent } from '@polito/lib/ui';

import { BookingSlotsLegendContent } from './BookingSlotsLegendContent';

type Props = {
  close: () => void;
};

export const BookingSlotsLegendModal = ({ close }: Props) => {
  const { t } = useTranslation();

  return (
    <ModalContent close={close} title={t('common.legend')}>
      <BookingSlotsLegendContent />
    </ModalContent>
  );
};
