import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform } from 'react-native';

import { useScreenTitle } from '@polito/lib/core';
import {
  BottomBarSpacer,
  IndentedDivider,
  OverviewList,
  RefreshControl,
  useSafeAreaSpacing,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetSurveys } from '../../../core/queries/surveysHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { SurveyListItem } from '../components/SurveyListItem';

type Props = NativeStackScreenProps<ServiceStackParamList, 'SurveyList'>;

export const SurveyListScreen = ({ route }: Props) => {
  const { t } = useTranslation();
  const { isCompiled } = route.params;

  const surveysQuery = useGetSurveys();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { buildCompositeListLabel } = useAccessibility();

  const compiledSurveys = (surveysQuery.data || [])
    .filter(survey => survey.isCompiled === isCompiled)
    .sort(
      (a, b) =>
        b.startsAt.getTime() - a.startsAt.getTime() &&
        b.title.localeCompare(a.title),
    );

  const labels = useMemo(() => {
    return {
      title: isCompiled
        ? t('surveysScreen.compiledTitle')
        : t('surveysScreen.toBeCompiledTitle'),
      emptyState: isCompiled
        ? t('ticketsScreen.closedEmptyState')
        : t('ticketsScreen.openEmptyState'),
    };
  }, [isCompiled, t]);

  useScreenTitle(labels.title);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={paddingHorizontal}
      refreshControl={<RefreshControl queries={[surveysQuery]} manual />}
      accessibilityRole="list"
      accessibilityLabel={t('surveysScreen.surveysList', {
        count: compiledSurveys.length,
      })}
      data={compiledSurveys}
      renderItem={({ item, index }) => (
        <SurveyListItem
          survey={item}
          key={item.id}
          accessibilityLabel={buildCompositeListLabel(
            [item.title, item.subtitle ?? undefined],
            index,
            compiledSurveys.length,
          )}
        />
      )}
      ItemSeparatorComponent={Platform.select({
        ios: IndentedDivider,
      })}
      ListFooterComponent={<BottomBarSpacer />}
      ListEmptyComponent={<OverviewList emptyStateText={labels.emptyState} />}
    />
  );
};
