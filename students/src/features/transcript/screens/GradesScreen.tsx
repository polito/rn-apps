import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import {
  useGetGrades,
  useGetProvisionalGrades,
} from '../../../core/queries/studentHooks';
import { ProvisionalGradeListItem } from '../components/ProvisionalGradeListItem';
import { RecordedGradeListItem } from '../components/RecordedGradeListItem';

export const GradesScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { getListAccessibilityProps } = useAccessibility();
  const gradesQuery = useGetGrades();
  const provisionalGradesQuery = useGetProvisionalGrades();

  const isOffline = useOfflineDisabled();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          queries={[gradesQuery, provisionalGradesQuery]}
          manual
        />
      }
    >
      <SafeAreaView>
        <Section>
          <SectionHeader
            title={t('transcriptGradesScreen.provisionalTitle')}
            accessibilityLabel={`${t('common.transcript')} ${t(
              'transcriptGradesScreen.total', // TODO SWITCH STRING TO PROVISIONAL
              { total: provisionalGradesQuery.data?.length || 0 },
            )}`}
          />
          <View
            {...getListAccessibilityProps(
              t('transcriptGradesScreen.provisionalTitle'),
              provisionalGradesQuery.data?.length ?? 0,
            )}
          >
            <OverviewList
              loading={!isOffline && provisionalGradesQuery.isLoading}
              emptyStateText={
                isOffline && provisionalGradesQuery.isLoading
                  ? t('common.cacheMiss')
                  : t('transcriptGradesScreen.provisionalEmptyState')
              }
            >
              {provisionalGradesQuery.data?.map((grade, index) => (
                <ProvisionalGradeListItem
                  key={grade.id}
                  grade={grade}
                  index={index}
                  total={provisionalGradesQuery.data?.length ?? 0}
                />
              ))}
            </OverviewList>
          </View>
        </Section>
        <Section>
          <SectionHeader
            title={t('transcriptGradesScreen.recordedTitle')}
            accessibilityLabel={`${t('common.transcript')} ${t(
              'transcriptGradesScreen.total',
              { total: gradesQuery.data?.length || 0 },
            )}`}
          />
          <View
            {...getListAccessibilityProps(
              t('transcriptGradesScreen.recordedTitle'),
              gradesQuery.data?.length ?? 0,
            )}
          >
            <OverviewList
              loading={!isOffline && gradesQuery.isLoading}
              emptyStateText={
                isOffline && gradesQuery.isLoading
                  ? t('common.cacheMiss')
                  : t('transcriptGradesScreen.emptyState')
              }
            >
              {gradesQuery.data?.map((grade, index) => (
                <RecordedGradeListItem
                  grade={grade}
                  key={grade.courseName}
                  index={index}
                  total={gradesQuery.data?.length ?? 0}
                />
              ))}
            </OverviewList>
          </View>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    chartCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
      marginTop: spacing[2],
      marginBottom: spacing[3],
    },
    metricsCard: {
      padding: spacing[4],
      marginTop: spacing[2],
    },
    spaceBottom: {
      marginBottom: spacing[2],
    },
    additionalMetric: {
      marginTop: spacing[4],
    },
    grade: {
      marginLeft: spacing[2],
    },
  });
