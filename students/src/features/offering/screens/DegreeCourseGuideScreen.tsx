import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { sanitizeHtml } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { Card } from '@polito/lib';
import { Col } from '@polito/lib';
import { HtmlView } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { Section } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGetOfferingCourse } from '../../../core/queries/offeringHooks';
import { ServiceStackParamList } from '../../services/components/ServicesNavigator';

type Props = NativeStackScreenProps<ServiceStackParamList, 'DegreeCourseGuide'>;
export const DegreeCourseGuideScreen = ({ route }: Props) => {
  const { courseShortcode, year } = route.params;
  const courseQuery = useGetOfferingCourse({ courseShortcode, year });
  const offeringCourse = courseQuery.data;

  const styles = useStylesheet(createStyles);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl queries={[courseQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <Card padded gapped style={styles.card}>
            {offeringCourse?.guide.map((section, i) => (
              <Col key={i}>
                <Text variant="subHeading" accessibilityRole="header">
                  {section.title}
                </Text>
                <HtmlView
                  props={{
                    source: { html: sanitizeHtml(section.content) },
                    baseStyle: styles.html,
                  }}
                  variant="longProse"
                />
              </Col>
            ))}
          </Card>
        </Section>
      </SafeAreaView>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ fontSizes, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    card: {
      marginVertical: spacing[2],
      marginHorizontal: Platform.select({ ios: spacing[4] }),
    },
    html: {
      lineHeight: fontSizes.sm * 1.5,
      padding: 0,
    },
  });
