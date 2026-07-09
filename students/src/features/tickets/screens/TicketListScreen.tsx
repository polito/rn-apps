import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { useScreenTitle } from '@polito/lib/core';
import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  useSafeAreaSpacing,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  isConcludedTicketStatus,
  useGetTickets,
} from '../../../core/queries/ticketHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { TicketListItem } from '../components/TicketListItem';

type Props = NativeStackScreenProps<ServiceStackParamList, 'TicketList'>;

export const TicketListScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const { statuses } = route.params;
  const ticketsQuery = useGetTickets();
  const { paddingHorizontal } = useSafeAreaSpacing();

  const tickets = useMemo(
    () =>
      ticketsQuery.data
        ?.filter(ticket => statuses.includes(ticket.status))
        ?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()) ?? [],
    [ticketsQuery, statuses],
  );

  const labels = useMemo(() => {
    const closedTicket = statuses.some(isConcludedTicketStatus);
    return {
      title: closedTicket
        ? t('ticketsScreen.closed')
        : t('ticketsScreen.opened'),
      emptyState: closedTicket
        ? t('ticketsScreen.closedEmptyState')
        : t('ticketsScreen.openEmptyState'),
    };
  }, [statuses, t]);

  useScreenTitle(labels.title);

  if (!ticketsQuery.isLoading && !tickets.length) {
    return <OverviewList emptyStateText={labels.emptyState} />;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={paddingHorizontal}
      refreshControl={<RefreshControl queries={[ticketsQuery]} manual />}
    >
      <OverviewList indented>
        {tickets.map(ticket => (
          <TicketListItem ticket={ticket} key={ticket.id} />
        ))}
      </OverviewList>
      <BottomBarSpacer />
    </ScrollView>
  );
};
