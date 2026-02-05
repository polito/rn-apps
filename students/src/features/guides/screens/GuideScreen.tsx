import { useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { usePreferencesContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  OverviewList,
  RefreshControl,
  ScreenTitle,
  Section,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { useGetGuides } from '../../../core/queries/studentHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';
import { GuideFieldListItem } from '../components/GuideFieldListItem';
import { GuideSectionListItem } from '../components/GuideSectionListItem';

type Props = NativeStackScreenProps<ServiceStackParamList, 'Guide'>;

export const GuideScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const styles = useStylesheet(createStyles);
  const query = useGetGuides();

  const { emailGuideRead, updatePreference } =
    usePreferencesContext<AppPreferences>();

  const guide = useMemo(() => {
    if (!query.data) return;
    return query.data.find(g => g.id === id);
  }, [id, query.data]);

  useEffect(() => {
    if (!guide) return;

    if (guide.id === 'email' && emailGuideRead !== true) {
      updatePreference('emailGuideRead', true);
    }

    navigation.setOptions({
      headerTitle: guide?.listTitle,
    });
  }, [guide, navigation, emailGuideRead, updatePreference]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[query]} manual />}
    >
      <SafeAreaView>
        <Section style={styles.paddingTop}>
          <ScreenTitle title={guide?.title ?? ''} padded />
        </Section>
        <Section>
          <Card padded style={styles.card}>
            <Text>{guide?.intro}</Text>
          </Card>
          <OverviewList indented loading={query.isLoading}>
            {guide?.fields.map(field => {
              return <GuideFieldListItem field={field} key={field.label} />;
            })}
          </OverviewList>
          <Card padded style={styles.card}>
            {guide?.sections.map(section => {
              return (
                <GuideSectionListItem section={section} key={section.title} />
              );
            })}
          </Card>
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    paddingTop: { paddingTop: spacing[2] },
    card: { paddingHorizontal: spacing[5] },
  });
