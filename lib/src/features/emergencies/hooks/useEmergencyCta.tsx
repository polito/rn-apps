import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faPhone } from '@fortawesome/free-solid-svg-icons';
import {
  EmergencyCta,
  EmergencyCtaType,
  EmergencySite,
} from '@polito/student-api-client';

import { useFeedbackContext } from '../../../core/contexts/FeedbackContext';
import { Icon } from '../../../ui/components/Icon';
import { ListItem } from '../../../ui/components/ListItem';
import { ModalContent } from '../../../ui/components/ModalContent';
import { useBottomModal } from '../../../ui/hooks/useBottomModal';
import { useTheme } from '../../../ui/hooks/useTheme';

const toPhoneUrl = (phoneNumber: string) =>
  `tel:${phoneNumber.replace(/[^+\d]/g, '')}`;

export const useEmergencyCta = (sites: EmergencySite[] = []) => {
  const { t } = useTranslation();
  const { palettes } = useTheme();
  const { bottom } = useSafeAreaInsets();
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
      <ModalContent title={t('emergenciesScreen.selectSite')} close={close}>
        <View style={{ paddingBottom: bottom }}>
          {sites.map(site => (
            <ListItem
              key={site.siteId}
              title={site.name}
              subtitle={site.phoneNumber}
              trailingItem={
                <Icon icon={faPhone} color={palettes.danger[600]} />
              }
              onPress={() => openUrl(toPhoneUrl(site.phoneNumber))}
            />
          ))}
        </View>
      </ModalContent>,
    );
  }, [bottom, close, open, openUrl, palettes.danger, sites, t]);

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
