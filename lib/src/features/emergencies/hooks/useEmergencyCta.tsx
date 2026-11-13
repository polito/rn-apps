import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import {
  EmergencyCta,
  EmergencyCtaType,
  EmergencySite,
} from '@polito/student-api-client';

import { useFeedbackContext } from '../../../core/contexts/FeedbackContext';
import { useBottomModal } from '../../../ui/hooks/useBottomModal';
import { EmergencySitesModalContent } from '../components/EmergencySitesModalContent';

const toPhoneUrl = (phoneNumber: string) =>
  `tel:${phoneNumber.replace(/[^+\d]/g, '')}`;

export const useEmergencyCta = (sites: EmergencySite[] = []) => {
  const { t } = useTranslation();
  const { setFeedback } = useFeedbackContext();
  const { open, close, modal } = useBottomModal();

  const openUrl = useCallback(
    (url?: string) => {
      const showError = () =>
        setFeedback({
          text: t('common.somethingWentWrong'),
          isError: true,
          isPersistent: false,
        });

      if (!url) {
        showError();
        return;
      }
      Linking.openURL(url).catch(showError);
    },
    [setFeedback, t],
  );

  const openSites = useCallback(() => {
    open(
      <EmergencySitesModalContent
        sites={sites}
        close={close}
        onCallSite={site => openUrl(toPhoneUrl(site.phoneNumber))}
      />,
    );
  }, [close, open, openUrl, sites]);

  const onCtaPress = useCallback(
    (cta: EmergencyCta) => {
      switch (cta.type) {
        case EmergencyCtaType.Call:
          openUrl(cta.phoneNumber && toPhoneUrl(cta.phoneNumber));
          break;
        case EmergencyCtaType.Link:
          openUrl(cta.url);
          break;
        case EmergencyCtaType.Sites:
          if (sites.length === 1) {
            openUrl(toPhoneUrl(sites[0].phoneNumber));
          } else if (sites.length > 1) {
            openSites();
          } else {
            openUrl();
          }
          break;
      }
    },
    [openSites, openUrl, sites],
  );

  return { onCtaPress, modal };
};
