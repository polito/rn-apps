import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { useScreenTitle } from '@polito/lib/core';
import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import {
  useGetCpdSurveys,
  useGetSurveys,
} from '../../../core/queries/surveysHooks';
import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import { SurveyListItem } from '../components/SurveyListItem';

type Props = NativeStackScreenProps<TeachingStackParamList, 'CpdSurveys'>;

export const CpdSurveysScreen = ({ route }: Props) => {
  const surveysQuery = useGetSurveys();
  const { data } = useGetCpdSurveys();

  const { t } = useTranslation();
  const { buildCompositeListLabel, getListAccessibilityProps } =
    useAccessibility();

  const { categoryId, typeId, typeName } = route.params;

  useScreenTitle(typeName);

  const surveys = useMemo(
    () =>
      data?.filter(
        survey =>
          survey.category.id === categoryId && survey.type.id === typeId,
      ),
    [categoryId, data, typeId],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[surveysQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <View {...getListAccessibilityProps(typeName, surveys?.length ?? 0)}>
            <OverviewList
              emptyStateText={
                surveys && surveys.length === 0
                  ? t('cpdSurveysScreen.emptyState')
                  : undefined
              }
              indented
              loading={surveysQuery.isLoading}
            >
              {surveys?.map((survey, index) => (
                <SurveyListItem
                  key={survey.id}
                  survey={survey}
                  accessibilityLabel={buildCompositeListLabel(
                    [survey.title],
                    index,
                    surveys.length,
                  )}
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
