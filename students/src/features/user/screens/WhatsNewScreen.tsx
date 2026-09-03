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

import {
  getWhatsNewArchiveAnnouncements,
  useGetAnnouncements,
} from '../../../core/queries/announcementHooks';
import { WhatsNewListItem } from '../components/WhatsNewListItem';

export const WhatsNewScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { isEnabled, announce } = useScreenReader();
  const announcementsQuery = useGetAnnouncements();

  const announcements = useMemo(
    () => getWhatsNewArchiveAnnouncements(announcementsQuery.data),
    [announcementsQuery.data],
  );

  useEffect(() => {
    if (!isEnabled) return;

    if (announcementsQuery.isLoading) {
      announce(t('appInfoScreen.whatsNewLoading'));
      return;
    }

    if (!announcementsQuery.data) return;

    announce(
      announcements.length === 0
        ? t('appInfoScreen.whatsNewEmpty')
        : t('appInfoScreen.whatsNewListLoaded'),
    );
  }, [
    announcements.length,
    announcementsQuery.data,
    announcementsQuery.isLoading,
    announce,
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
                ? t('appInfoScreen.whatsNewLoading')
                : t('appInfoScreen.whatsNewListLabel', {
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
              emptyStateText={t('appInfoScreen.whatsNewEmpty')}
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
