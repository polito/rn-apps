import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { getHtmlTextContent } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { Card } from '@polito/lib';
import { LoadingContainer } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { ScreenTitle } from '@polito/lib';
import { Section } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';

import { useGetOfferingDegree } from '../../../core/queries/offeringHooks';
import { useDegreeContext } from '../contexts/DegreeContext';

export const DegreeInfoScreen = () => {
  const { degreeId, year } = useDegreeContext();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const degreeQuery = useGetOfferingDegree({ degreeId, year });
  const degree = degreeQuery?.data;
  const isLoading = degreeQuery.isLoading;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[degreeQuery]} manual />}
    >
      <SafeAreaView>
        <LoadingContainer loading={isLoading}>
          <>
            <ScreenTitle
              style={styles.heading}
              title={degree?.name || degree?.id}
            />
            <Card padded style={styles.overviewCard}>
              {degree?.location && (
                <Text>
                  <Text style={styles.label}>{t('common.location')}: </Text>
                  <Text>{degree?.location}</Text>
                </Text>
              )}
              {degree?.department?.name && (
                <Text>
                  <Text style={styles.label}>{t('common.department')}: </Text>
                  <Text>{degree?.department?.name}</Text>
                </Text>
              )}
              {degree?.faculty?.name && (
                <Text>
                  <Text style={styles.label}>{t('common.faculty')}: </Text>
                  <Text>{degree?.faculty.name}</Text>
                </Text>
              )}
              {degree?.duration && (
                <Text>
                  <Text style={styles.label}>{t('common.duration')}: </Text>
                  <Text>{degree?.duration}</Text>
                </Text>
              )}
              {degree?._class && (
                <Text>
                  <Text style={styles.label}>
                    {t('degreeScreen.degreeClass')}:{' '}
                  </Text>
                  <Text>
                    {degree?._class.name} ({degree._class.code})
                  </Text>
                </Text>
              )}
            </Card>
          </>
          <Section>
            <Card padded gapped>
              <View>
                <Text variant="subHeading">{t('common.notes')}</Text>
                {degree?.notes?.map((note, index) => (
                  <Text key={index} variant="longProse">
                    {getHtmlTextContent(note)}
                  </Text>
                ))}
              </View>
              {degree?.objectives?.content && (
                <View>
                  <Text variant="subHeading">{t('common.objectives')}</Text>
                  <Text variant="longProse">
                    {getHtmlTextContent(degree?.objectives?.content)}
                  </Text>
                </View>
              )}
            </Card>
          </Section>
        </LoadingContainer>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing, fontWeights, fontSizes }: Theme) =>
  StyleSheet.create({
    overviewCard: {
      gap: spacing[1],
    },
    heading: {
      paddingHorizontal: Platform.select({
        android: spacing[2],
        ios: spacing[4],
      }),
      paddingTop: spacing[3],
    },
    label: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
    },
  });
