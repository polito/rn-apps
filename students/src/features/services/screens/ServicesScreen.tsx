import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faBookBookmark,
  faBriefcase,
  faClipboardQuestion,
  faComments,
  faEnvelope,
  faIdCard,
  faMobileScreenButton,
  faNewspaper,
  faPersonCirclePlus,
  faSignsPost,
} from '@fortawesome/free-solid-svg-icons';
import {
  split,
  useOfflineDisabled,
  usePreferencesContext,
} from '@polito/lib/core';
import {
  BottomBarSpacer,
  Grid,
  Theme,
  auto,
  useStylesheet,
} from '@polito/lib/ui';
import { useQueryClient } from '@tanstack/react-query';

import { AppPreferences } from '~/core/types/preferences.ts';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useNotifications } from '../../../core/hooks/useNotifications';
import { useOpenInAppLink } from '../../../core/hooks/useOpenInAppLink.ts';
import {
  WEBMAIL_LINK_QUERY_KEY,
  useGetWebmailLink,
} from '../../../core/queries/authHooks.ts';
import { BOOKINGS_QUERY_KEY } from '../../../core/queries/bookingHooks';
import { useGetUnreadEmails } from '../../../core/queries/studentHooks.ts';
import { TICKETS_QUERY_KEY } from '../../../core/queries/ticketHooks';
import { ServiceCard } from '../components/ServiceCard';

export const ServicesScreen = () => {
  const { t } = useTranslation();
  const { getBadgeAccessibilityLabel } = useAccessibility();
  const {
    favoriteServices: favoriteServiceIds,
    emailGuideRead,
    updatePreference,
    peopleSearched,
    accessibility,
  } = usePreferencesContext<AppPreferences>();
  const { getUnreadsCount } = useNotifications();
  const styles = useStylesheet(createStyles);
  const isOffline = useOfflineDisabled();
  const queryClient = useQueryClient();
  const unreadTickets = getUnreadsCount(['services', 'tickets']);
  const unreadEmailsQuery = useGetUnreadEmails();
  const [fontSize, setFontSize] = useState(Number(accessibility?.fontSize));
  useEffect(() => {
    setFontSize(Number(accessibility?.fontSize) ?? 0);
  }, [accessibility?.fontSize]);
  const openInAppLink = useOpenInAppLink();
  const getWebmailLink = useGetWebmailLink();

  const openWebmailLink = useCallback(async () => {
    queryClient
      .fetchQuery({
        queryKey: WEBMAIL_LINK_QUERY_KEY,
        queryFn: getWebmailLink,
        staleTime: 55 * 1000, // 55 seconds
        gcTime: 55 * 1000, // 55 seconds
        persister: undefined, // disable persister
      })
      .then(res => openInAppLink(res.url));
  }, [openInAppLink, queryClient, getWebmailLink]);

  const services = useMemo(() => {
    const newsUnread = getUnreadsCount(['services', 'news']) ?? 0;
    const mailUnread = Number(unreadEmailsQuery.data?.unreadEmails ?? 0);
    const guidesUnread = emailGuideRead ? 0 : 1;
    const offlineHint = t('common.noInternet');

    return [
      {
        id: 'tickets',
        name: t('ticketsScreen.title'),
        icon: faComments,
        disabled:
          isOffline &&
          queryClient.getQueryData(TICKETS_QUERY_KEY) === undefined,
        linkTo: { screen: 'Tickets' },
        unReadCount: unreadTickets,
        accessibilityLabel: getBadgeAccessibilityLabel(
          unreadTickets ?? 0,
          t('ticketsScreen.title'),
        ),
        accessibilityHint:
          isOffline && queryClient.getQueryData(TICKETS_QUERY_KEY) === undefined
            ? offlineHint
            : undefined,
      },
      {
        id: 'appFeedback',
        name: t('common.appFeedback'),
        icon: faMobileScreenButton,
        disabled: isOffline,
        linkTo: {
          screen: 'CreateTicket',
          params: {
            topicId: 1101,
            subtopicId: 2001,
          },
        },
        accessibilityLabel: getBadgeAccessibilityLabel(
          0,
          t('common.appFeedback'),
        ),
        accessibilityHint: isOffline ? offlineHint : undefined,
      },
      {
        id: 'github',
        name: t('common.openSource'),
        icon: faGithub,
        onPress: () =>
          Linking.openURL('https://github.com/polito/students-app'),
        accessibilityLabel: t('common.openSourceAccessibilityLabel'),
      },
      {
        id: 'news',
        name: t('newsScreen.title'),
        icon: faNewspaper,
        disabled: isOffline,
        linkTo: {
          screen: 'News',
        },
        unReadCount: newsUnread,
        accessibilityLabel: getBadgeAccessibilityLabel(
          newsUnread,
          t('newsScreen.title'),
        ),
        accessibilityHint: isOffline ? offlineHint : undefined,
      },
      {
        id: 'jobOffers',
        name: t('jobOffersScreen.title'),
        icon: faBriefcase,
        disabled: isOffline,
        linkTo: { screen: 'JobOffers' },
        accessibilityLabel: getBadgeAccessibilityLabel(
          0,
          t('jobOffersScreen.title'),
        ),
        accessibilityHint: isOffline ? offlineHint : undefined,
      },
      {
        id: 'offering',
        name: t('offeringScreen.title'),
        icon: faBookBookmark,
        disabled: isOffline,
        linkTo: { screen: 'Offering' },
        accessibilityLabel: getBadgeAccessibilityLabel(
          0,
          t('offeringScreen.title'),
        ),
        accessibilityHint: isOffline ? offlineHint : undefined,
      },
      {
        id: 'contacts',
        name: t('contactsScreen.title'),
        icon: faIdCard,
        disabled: isOffline && peopleSearched?.length === 0, // TODO why?
        linkTo: { screen: 'Contacts' },
        accessibilityLabel: getBadgeAccessibilityLabel(
          0,
          t('contactsScreen.title'),
        ),
        accessibilityHint:
          isOffline && peopleSearched?.length === 0 ? offlineHint : undefined,
      },
      {
        id: 'guides',
        name: t('guidesScreen.title'),
        icon: faSignsPost,
        linkTo: { screen: 'Guides' },
        unReadCount: guidesUnread,
        accessibilityLabel: getBadgeAccessibilityLabel(
          guidesUnread,
          t('guidesScreen.title'),
        ),
      },
      {
        id: 'bookings',
        name: t('bookingsScreen.title'),
        icon: faPersonCirclePlus,
        disabled:
          isOffline &&
          queryClient.getQueryData(BOOKINGS_QUERY_KEY) === undefined,
        linkTo: { screen: 'Bookings' },
        accessibilityLabel: getBadgeAccessibilityLabel(
          0,
          t('bookingsScreen.title'),
        ),
        accessibilityHint:
          isOffline &&
          queryClient.getQueryData(BOOKINGS_QUERY_KEY) === undefined
            ? offlineHint
            : undefined,
      },
      {
        id: 'surveys',
        name: t('surveysScreen.title'),
        icon: faClipboardQuestion,
        disabled: isOffline,
        linkTo: { screen: 'Surveys' },
        accessibilityLabel: getBadgeAccessibilityLabel(
          0,
          t('surveysScreen.title'),
        ),
        accessibilityHint: isOffline ? offlineHint : undefined,
      },
      {
        id: 'mail',
        name: t('servicesScreen.webMail'),
        icon: faEnvelope,
        disabled: isOffline,
        unReadCount: mailUnread,
        onPress: () => openWebmailLink(),
        accessibilityLabel: getBadgeAccessibilityLabel(
          mailUnread,
          t('servicesScreen.webMail').replace('\n', ' '),
        ),
        accessibilityHint: isOffline ? offlineHint : undefined,
      },
    ];
  }, [
    t,
    isOffline,
    queryClient,
    unreadTickets,
    getUnreadsCount,
    getBadgeAccessibilityLabel,
    peopleSearched?.length,
    emailGuideRead,
    unreadEmailsQuery.data,
    openWebmailLink,
  ]);

  const [favoriteServices, otherServices] = useMemo(
    () =>
      services.reduce(
        split(s => favoriteServiceIds.includes(s.id)),
        [[], []],
      ),
    [favoriteServiceIds, services],
  );

  const updateFavorite =
    (service: (typeof services)[number]) => (favorite: boolean) => {
      const newVal = favorite
        ? [...new Set([...favoriteServiceIds, service.id])]
        : favoriteServiceIds.filter(fs => fs !== service.id);
      updatePreference('favoriteServices', newVal);
    };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        {favoriteServices.length > 0 && (
          <Grid
            numColumns={fontSize && fontSize >= 125 ? 1 : auto}
            minColumnWidth={ServiceCard.minWidth}
            maxColumnWidth={ServiceCard.maxWidth}
            gap={4}
            style={styles.grid}
          >
            {favoriteServices.map(service => (
              <ServiceCard
                key={service.id}
                name={service.name}
                icon={service.icon}
                disabled={service.disabled}
                linkTo={service.linkTo}
                onPress={service.onPress}
                favorite
                onFavoriteChange={updateFavorite(service)}
                unReadCount={service?.unReadCount}
                accessibilityLabel={service?.accessibilityLabel}
                accessibilityHint={service?.accessibilityHint}
              />
            ))}
          </Grid>
        )}

        {otherServices.length > 0 && (
          <Grid
            numColumns={fontSize && fontSize >= 125 ? 1 : auto}
            minColumnWidth={ServiceCard.minWidth}
            maxColumnWidth={ServiceCard.maxWidth}
            gap={4}
            style={styles.grid}
          >
            {otherServices.map(service => (
              <ServiceCard
                key={service.id}
                name={service.name}
                icon={service.icon}
                disabled={service.disabled}
                linkTo={service.linkTo}
                onPress={service.onPress}
                onFavoriteChange={updateFavorite(service)}
                unReadCount={service?.unReadCount}
                accessibilityLabel={service?.accessibilityLabel}
                accessibilityHint={service?.accessibilityHint}
              />
            ))}
          </Grid>
        )}
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    grid: {
      margin: spacing[5],
    },
  });
