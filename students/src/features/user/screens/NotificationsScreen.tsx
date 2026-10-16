import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, SafeAreaView, ScrollView } from 'react-native';

import {
  faComments,
  faPersonCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { IS_ANDROID, useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Col,
  Icon,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  SwitchListItem,
  useTheme,
} from '@polito/lib/ui';

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

  const announceToggle = (previousValue?: boolean) => {
    if (IS_ANDROID) {
      return;
    }
    const message = previousValue
      ? t('common.deactivated')
      : t('common.activated');
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(message);
    }, 200);
  };

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
                accessibilityLabel={[
                  t('common.ticket_plural'),
                  data?.tickets ? t('common.enabled') : t('common.disabled'),
                ].join(', ')}
                accessibilityHint={
                  data?.tickets
                    ? t('common.click2Deactivate')
                    : t('common.click2Active')
                }
                disabled={isOffline}
                value={data?.tickets}
                onChange={() => {
                  updatePreference({
                    notificationType: 'tickets',
                    targetValue: !data?.tickets,
                  });
                  announceToggle(data?.tickets);
                }}
              />
              <SwitchListItem
                leadingItem={
                  <Icon icon={faPersonCirclePlus} size={fontSizes['2xl']} />
                }
                title={t('common.booking_plural')}
                accessibilityLabel={[
                  t('common.booking_plural'),
                  data?.bookings ? t('common.enabled') : t('common.disabled'),
                ].join(', ')}
                accessibilityHint={
                  data?.bookings
                    ? t('common.click2Deactivate')
                    : t('common.click2Active')
                }
                disabled={isOffline}
                value={data?.bookings}
                onChange={() => {
                  updatePreference({
                    notificationType: 'bookings',
                    targetValue: !data?.bookings,
                  });
                  announceToggle(data?.bookings);
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
