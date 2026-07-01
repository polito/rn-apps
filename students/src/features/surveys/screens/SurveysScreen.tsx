import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  BottomBarSpacer,
  OverviewList,
  RefreshControl,
  Section,
  SectionHeader,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetSurveys } from '../../../core/queries/surveysHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { SurveyListItem } from '../components/SurveyListItem';

interface Props {
  navigation: NativeStackNavigationProp<ServiceStackParamList, 'Surveys'>;
}

const IncompleteSurveys = () => {
  const surveysQuery = useGetSurveys();
  const { t } = useTranslation();
  const { buildCompositeListLabel } = useAccessibility();

  const incompleteSurveys = (surveysQuery.data || [])
    .filter(survey => !survey.isCompiled)
    .sort(
      (a, b) =>
        b.startsAt.getTime() - a.startsAt.getTime() &&
        b.title.localeCompare(a.title),
    );

  return (
    <Section>
      <SectionHeader
        title={t('surveysScreen.toBeCompiledTitle')}
        accessibilityLabel={`${t('surveysScreen.toBeCompiledTitle')}, ${incompleteSurveys.length}`}
      />
      {!surveysQuery.isLoading &&
        (incompleteSurveys.length > 0 ? (
          <OverviewList indented>
            {incompleteSurveys?.map((survey, index) => (
              <SurveyListItem
                survey={survey}
                key={survey.id}
                accessibilityLabel={buildCompositeListLabel(
                  [survey.title],
                  index,
                  incompleteSurveys.length,
                )}
              />
            ))}
          </OverviewList>
        ) : (
          <OverviewList
            emptyStateText={t('surveysScreen.toBeCompiledEmptyState')}
          />
        ))}
    </Section>
  );
};

const CompiledSurveys = () => {
  const surveysQuery = useGetSurveys();
  const { t } = useTranslation();
  const { buildCompositeListLabel } = useAccessibility();

  const compiledSurveys = (surveysQuery.data || [])
    .filter(survey => survey.isCompiled)
    .sort(
      (a, b) =>
        b.startsAt.getTime() - a.startsAt.getTime() &&
        b.title.localeCompare(a.title),
    );

  const renderedCompiledSurveys = useMemo(
    () => compiledSurveys.slice(0, 4),
    [compiledSurveys],
  );

  return (
    <Section>
      <SectionHeader
        title={t('surveysScreen.compiledTitle')}
        linkTo={{
          screen: 'SurveyList',
          params: { isCompiled: true },
        }}
        linkToMoreCount={
          compiledSurveys.length - renderedCompiledSurveys.length
        }
      />
      {!surveysQuery.isLoading &&
        (renderedCompiledSurveys.length > 0 ? (
          <OverviewList indented>
            {renderedCompiledSurveys.map((survey, index) => (
              <SurveyListItem
                survey={survey}
                key={survey.id}
                accessibilityLabel={buildCompositeListLabel(
                  [survey.title],
                  index,
                  renderedCompiledSurveys.length,
                )}
              />
            ))}
          </OverviewList>
        ) : (
          <OverviewList
            emptyStateText={t('surveysScreen.compiledEmptyState')}
          />
        ))}
    </Section>
  );
};

export const SurveysScreen = (_: Props) => {
  const styles = useStylesheet(createStyles);
  const surveysQuery = useGetSurveys();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[surveysQuery]} manual />}
      contentContainerStyle={styles.container}
    >
      <SafeAreaView>
        <IncompleteSurveys />
        <CompiledSurveys />
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
  });
