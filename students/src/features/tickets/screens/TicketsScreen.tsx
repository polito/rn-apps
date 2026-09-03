import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getHtmlTextContent } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonSpacer,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  type Theme,
  useSafeBottomBarHeight,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { TicketOverview } from '@polito/student-api-client';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onlineManager } from '@tanstack/react-query';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useNotifications } from '../../../core/hooks/useNotifications';
import {
  getTicketStatusGroup,
  useGetTickets,
} from '../../../core/queries/ticketHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { TicketListItem } from '../components/TicketListItem';

interface Props {
  navigation: NativeStackNavigationProp<ServiceStackParamList, 'Tickets'>;
}

const getTicketRank = (ticket: TicketOverview) => {
  const group = getTicketStatusGroup(ticket.status);
  if (group === 'waitingUser') return ticket.unreadCount > 0 ? 0 : 1;
  if (group === 'open') return 2;
  if (group === 'duplicate') return 5;
  return ticket.needsFeedback ? 3 : 4;
};

const ListItem = ({
  ticket,
  index,
  totalData,
}: {
  ticket: TicketOverview;
  index: number;
  totalData: number;
}) => {
  const { getUnreadsCount } = useNotifications();
  const unread = useMemo(
    () => !!getUnreadsCount(['services', 'tickets', ticket.id.toString()]),
    [getUnreadsCount, ticket.id],
  );
  const { accessibilityListLabel } = useAccessibility();
  const accessibilityLabel = [
    accessibilityListLabel(index, totalData),
    getHtmlTextContent(ticket?.subject),
  ].join(', ');

  return (
    <TicketListItem
      accessibilityLabel={accessibilityLabel}
      ticket={ticket}
      key={ticket.id}
      unread={unread}
    />
  );
};

const CtaFade = () => {
  const { colors } = useTheme();
  const bottomBarHeight = useSafeBottomBarHeight();
  const styles = useStylesheet(createStyles);

  return (
    <View
      pointerEvents="none"
      style={[styles.fade, { bottom: bottomBarHeight }]}
    >
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="ctaFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.background} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#ctaFade)" />
      </Svg>
    </View>
  );
};

export const TicketsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const ticketsQuery = useGetTickets();

  const tickets = useMemo(
    () =>
      (ticketsQuery.data ?? []).slice().sort((a, b) => {
        const rankDifference = getTicketRank(a) - getTicketRank(b);
        if (rankDifference !== 0) {
          return rankDifference;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      }),
    [ticketsQuery.data],
  );

  useFocusEffect(
    useCallback(() => {
      if (!ticketsQuery.data || tickets.length > 0) {
        return;
      }
      AccessibilityInfo.announceForAccessibility(t('ticketsScreen.emptyState'));
    }, [tickets, t, ticketsQuery.data]),
  );

  const sectionHeaderAccessibilityLabel = useMemo(() => {
    const baseText = t('ticketsScreen.myTickets');
    return tickets.length > 0
      ? baseText
      : [baseText, t('ticketsScreen.emptyState')].join(', ');
  }, [tickets, t]);

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl queries={[ticketsQuery]} manual />}
        contentContainerStyle={styles.container}
      >
        <SafeAreaView>
          <Section>
            <SectionHeader
              accessibilityLabel={sectionHeaderAccessibilityLabel}
              title={t('ticketsScreen.myTickets')}
            />
            {!ticketsQuery.isLoading &&
              (tickets.length > 0 ? (
                <OverviewList indented>
                  {tickets.map((ticket, index) => (
                    <ListItem
                      totalData={tickets.length}
                      index={index}
                      ticket={ticket}
                      key={ticket.id}
                    />
                  ))}
                </OverviewList>
              ) : (
                <OverviewList emptyStateText={t('ticketsScreen.emptyState')} />
              ))}
          </Section>
          <CtaButtonSpacer />
          <BottomBarSpacer />
        </SafeAreaView>
      </ScrollView>

      <CtaFade />

      <CtaButton
        absolute={true}
        disabled={!onlineManager.isOnline()}
        title={t('ticketsScreen.addNew')}
        action={() => navigation.navigate('TicketFaqs')}
        icon={faPlus}
      />
    </>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: spacing[24],
    },
  });
