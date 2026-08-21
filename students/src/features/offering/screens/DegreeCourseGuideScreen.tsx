import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { getHtmlTextContent, sanitizeHtml } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  Col,
  HtmlView,
  RefreshControl,
  Section,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
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
                <View
                  accessible={true}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityLabel={getHtmlTextContent(section.content)}
                >
                  <HtmlView
                    props={{
                      source: { html: sanitizeHtml(section.content) },
                      baseStyle: styles.html,
                    }}
                    variant="longProse"
                  />
                </View>
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
