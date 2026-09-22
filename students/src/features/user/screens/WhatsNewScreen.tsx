import { Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { useScreenReader } from '@polito/lib/core';
import {
  Divider,
  OverviewList,
  RefreshControl,
  Section,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  getAppInfoAnnouncements,
  getWhatsNewArchiveAnnouncements,
  useGetAnnouncements,
} from '../../../core/queries/announcementHooks';
import { UserStackParamList } from '../components/UserNavigator';
import { WhatsNewListItem } from '../components/WhatsNewListItem';

type Props = NativeStackScreenProps<
  UserStackParamList,
  'WhatsNew' | 'RecentCommunications'
>;

const SCREEN_CONFIG = {
  WhatsNew: {
    getAnnouncements: getWhatsNewArchiveAnnouncements,
    loadingKey: 'appInfoScreen.whatsNewLoading',
    emptyKey: 'appInfoScreen.whatsNewEmpty',
    loadedKey: 'appInfoScreen.whatsNewListLoaded',
    listLabelKey: 'appInfoScreen.whatsNewListLabel',
  },
  RecentCommunications: {
    getAnnouncements: getAppInfoAnnouncements,
    loadingKey: 'appInfoScreen.recentCommunicationsLoading',
    emptyKey: 'appInfoScreen.recentCommunicationsEmpty',
    loadedKey: 'appInfoScreen.recentCommunicationsListLoaded',
    listLabelKey: 'appInfoScreen.recentCommunicationsListCount',
  },
} as const;

export const WhatsNewScreen = ({ route }: Props) => {
  const config = SCREEN_CONFIG[route.name];
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { isEnabled, announce } = useScreenReader();
  const announcementsQuery = useGetAnnouncements();

  const announcements = useMemo(
    () => config.getAnnouncements(announcementsQuery.data),
    [announcementsQuery.data, config],
  );

  useEffect(() => {
    if (!isEnabled) return;

    if (announcementsQuery.isLoading) {
      announce(t(config.loadingKey));
      return;
    }

    if (!announcementsQuery.data) return;

    announce(
      announcements.length === 0 ? t(config.emptyKey) : t(config.loadedKey),
    );
  }, [
    announcements.length,
    announcementsQuery.data,
    announcementsQuery.isLoading,
    announce,
    config,
    isEnabled,
    t,
  ]);

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[announcementsQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <View
            accessibilityRole="list"
            accessibilityLabel={
              announcementsQuery.isLoading
                ? t(config.loadingKey)
                : t(config.listLabelKey, {
                    count: announcements.length,
                  })
            }
          >
            <OverviewList
              dividers={false}
              rounded={false}
              indented={false}
              style={styles.list}
              loading={announcementsQuery.isLoading}
              emptyStateText={t(config.emptyKey)}
            >
              {announcements.map((announcement, index) => (
                <Fragment key={announcement.id}>
                  <WhatsNewListItem
                    announcement={announcement}
                    index={index}
                    totalData={announcements.length}
                  />
                  {index < announcements.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </Fragment>
              ))}
            </OverviewList>
          </View>
        </Section>
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    list: {
      backgroundColor: colors.background,
      elevation: 0,
      marginHorizontal: 0,
      marginVertical: 0,
    },
    divider: {
      marginHorizontal: spacing[5],
    },
  });
