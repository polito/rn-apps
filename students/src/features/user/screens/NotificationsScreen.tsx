import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

import {
  faComments,
  faPersonCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { Col } from '@polito/lib';
import { Icon } from '@polito/lib';
import { OverviewList } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { Section } from '@polito/lib';
import { SectionHeader } from '@polito/lib';
import { SwitchListItem } from '@polito/lib';
import { useTheme } from '@polito/lib';

import {
  useGetNotificationPreferences,
  useUpdateNotificationPreference,
} from '../../../core/queries/studentHooks';

export const NotificationsScreen = () => {
  const { t } = useTranslation();

  const query = useGetNotificationPreferences();
  const { mutate: updatePreference } = useUpdateNotificationPreference();
  const { data, isLoading } = query;

  const { fontSizes } = useTheme();
  const isOffline = useOfflineDisabled();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[query]} manual />}
    >
      <SafeAreaView>
        <Col pv={2}>
          <Section>
            <SectionHeader
              title={t('notificationsScreen.globalTitle')}
              subtitle={t('notificationsScreen.globalSubtitle')}
            />
            <OverviewList indented loading={isLoading}>
              <SwitchListItem
                leadingItem={<Icon icon={faComments} size={fontSizes['2xl']} />}
                title={t('common.ticket_plural')}
                disabled={isOffline}
                value={data?.tickets}
                onChange={() => {
                  updatePreference({
                    notificationType: 'tickets',
                    targetValue: !data?.tickets,
                  });
                }}
              />
              <SwitchListItem
                leadingItem={
                  <Icon icon={faPersonCirclePlus} size={fontSizes['2xl']} />
                }
                title={t('common.booking_plural')}
                disabled={isOffline}
                value={data?.bookings}
                onChange={() => {
                  updatePreference({
                    notificationType: 'bookings',
                    targetValue: !data?.bookings,
                  });
                }}
              />
            </OverviewList>
          </Section>
        </Col>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
