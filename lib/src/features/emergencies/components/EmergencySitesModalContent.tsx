import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  faChevronDown,
  faChevronUp,
  faLocationCrosshairs,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { EmergencySite } from '@polito/student-api-client';

import { useGeolocation } from '../../../core/hooks/useGeolocation';
import { Icon } from '../../../ui/components/Icon';
import { ListItem } from '../../../ui/components/ListItem';
import { ModalContent } from '../../../ui/components/ModalContent';
import { Row } from '../../../ui/components/Row';
import { Text } from '../../../ui/components/Text';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { useGetSites } from '../../places/queries/placesHooks';

type Coordinates = { latitude: number; longitude: number };

/** Max distance (km) to consider the user to be at the nearest site */
const CURRENT_SITE_MAX_DISTANCE_KM = 2;

type Props = {
  sites: EmergencySite[];
  close: () => void;
  onCallSite: (site: EmergencySite) => void;
};

export const EmergencySitesModalContent = ({
  sites,
  close,
  onCallSite,
}: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { bottom } = useSafeAreaInsets();
  const [showOtherSites, setShowOtherSites] = useState(false);
  const [position, setPosition] = useState<Coordinates>();
  const { getCurrentPosition, computeDistance } = useGeolocation();
  const { data: placesSites } = useGetSites();

  useEffect(() => {
    getCurrentPosition()
      .then(setPosition)
      // Without a position the first non-backup site is shown
      .catch(() => {});
  }, [getCurrentPosition]);

  const { mainSite, isCurrentSite } = useMemo(() => {
    const fallback = sites.find(site => !site.backup) ?? sites[0];
    if (!position) return { mainSite: fallback, isCurrentSite: false };

    const nearest = sites
      .filter(site => !site.backup)
      .map(site => {
        const place = placesSites?.data?.find(s => s.id === site.siteId);
        return {
          site,
          distance: place ? computeDistance(position, place) : undefined,
        };
      })
      .filter(
        (item): item is { site: EmergencySite; distance: number } =>
          item.distance !== undefined,
      )
      .sort((a, b) => a.distance - b.distance)[0];

    if (!nearest) return { mainSite: fallback, isCurrentSite: false };
    return {
      mainSite: nearest.site,
      isCurrentSite: nearest.distance <= CURRENT_SITE_MAX_DISTANCE_KM,
    };
  }, [computeDistance, placesSites?.data, position, sites]);

  const otherSites = sites.filter(site => site !== mainSite);

  const renderSite = (site: EmergencySite, isCurrent = false) => (
    <ListItem
      key={site.siteId}
      title={site.name}
      subtitle={
        isCurrent ? (
          <Row align="center" gap={1}>
            <Icon
              icon={faLocationCrosshairs}
              color={colors.secondaryText}
              size={fontSizes.sm}
            />
            <Text style={styles.currentLocation}>
              {t('emergenciesScreen.yourCurrentLocation')}
            </Text>
          </Row>
        ) : (
          site.phoneNumber
        )
      }
      style={styles.field}
      trailingItem={<Icon icon={faPhone} color={palettes.danger[600]} />}
      accessibilityLabel={`${site.name}, ${site.phoneNumber}`}
      onPress={() => onCallSite(site)}
    />
  );

  return (
    <ModalContent title={t('emergenciesScreen.callNearestSite')} close={close}>
      <View style={[styles.content, { paddingBottom: bottom }]}>
        {mainSite && renderSite(mainSite, isCurrentSite)}
        {otherSites.length > 0 && (
          <>
            <Text style={styles.or}>{t('emergenciesScreen.or')}</Text>
            <ListItem
              title={t(
                showOtherSites
                  ? 'emergenciesScreen.hideOtherSites'
                  : 'emergenciesScreen.viewOtherSites',
              )}
              style={styles.field}
              accessibilityState={{ expanded: showOtherSites }}
              trailingItem={
                <Icon
                  icon={showOtherSites ? faChevronUp : faChevronDown}
                  color={colors.secondaryText}
                />
              }
              onPress={() => setShowOtherSites(value => !value)}
            />
            {showOtherSites && otherSites.map(site => renderSite(site))}
          </>
        )}
      </View>
    </ModalContent>
  );
};

const createStyles = ({ colors, shapes, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      gap: spacing[2],
    },
    field: {
      backgroundColor: colors.background,
      borderRadius: shapes.md,
      overflow: 'hidden',
    },
    currentLocation: {
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
    or: {
      textAlign: 'center',
      fontSize: fontSizes.sm,
      color: colors.secondaryText,
    },
  });
