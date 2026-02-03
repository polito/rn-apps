import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { getHtmlTextContent } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { Card } from '@polito/lib';
import { LoadingContainer } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { Section } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';

import { useGetOfferingDegree } from '../../../core/queries/offeringHooks';
import { useDegreeContext } from '../contexts/DegreeContext';

export const DegreeJobOpportunitiesScreen = () => {
  const { degreeId, year } = useDegreeContext();
  const degreeQuery = useGetOfferingDegree({ degreeId, year });
  const styles = useStylesheet(createStyles);
  const degree = degreeQuery?.data;
  const isLoading = degreeQuery.isLoading;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[degreeQuery]} manual />}
      contentContainerStyle={styles.list}
    >
      <SafeAreaView>
        <LoadingContainer loading={isLoading}>
          <Section>
            <Card padded>
              <Text variant="subHeading" style={styles.subHeading}>
                {degree?.jobOpportunities?.title}
              </Text>
              <Text variant="longProse">
                {getHtmlTextContent(degree?.jobOpportunities?.content ?? '')}
              </Text>
            </Card>
          </Section>
        </LoadingContainer>
      </SafeAreaView>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    card: {
      marginTop: Platform.select({ android: spacing[4] }),
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[2.5],
    },
    list: {
      paddingTop: spacing[2],
    },
    subHeading: {
      marginBottom: spacing[2],
    },
  });
