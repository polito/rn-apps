import { useTranslation } from 'react-i18next';

import { CtaButton } from '@polito/lib/ui';

interface ItineraryButtonProps {
  showItinerary: () => void;
}

const ItineraryButtonComponent = ({ showItinerary }: ItineraryButtonProps) => {
  const { t } = useTranslation();

  return (
    <CtaButton
      absolute={false}
      title={t('indicationsScreen.showIndications')}
      action={() => {
        showItinerary();
      }}
      style={{
        paddingHorizontal: 60,
      }}
    />
  );
};

export const ItineraryButton = ItineraryButtonComponent;
