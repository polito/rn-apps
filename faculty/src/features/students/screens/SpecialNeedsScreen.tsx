import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faChevronRight,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  Col,
  Icon,
  ListItem,
  OverviewList,
  Row,
  Text,
  Theme,
  createHeaderCloseButton,
  useHideTabs,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

type Props = NativeStackScreenProps<StudentsStackParamList, 'SpecialNeeds'>;

export const SpecialNeedsScreen = ({ navigation }: Props) => {
  useHideTabs();
  const { palettes, dark, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { setFeedback } = useFeedbackContext();
  const { selectedStudent } = useCourses();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerShadowVisible: false,
      headerRight:
        Platform.OS === 'ios' ? createHeaderCloseButton(navigation) : undefined,
    });
  }, [navigation]);

  const showComingSoon = () => {
    setFeedback({
      text: t('other.comingSoon', { defaultValue: 'Coming soon.' }),
    });
  };

  if (!selectedStudent) return null;

  const studentFullName = `${selectedStudent.name} ${selectedStudent.surname}`;
  const iconColor = dark ? palettes.gray[50] : palettes.primary[700];

  const measures = [
    {
      bold: t('other.specialNeedsCalculator', { defaultValue: 'Calculator' }),
      rest: ` ${t('other.specialNeedsCalculatorSuffix', { defaultValue: 'allowed' })}`,
    },
    {
      bold: t('other.specialNeedsReadabilityCriteria', {
        defaultValue: 'Readability criteria',
      }),
      rest: ` ${t('other.specialNeedsReadabilityCriteriaDetail', {
        defaultValue:
          '(Arial, 12-point font, 1.5 line spacing, non-justified text, expanded spacing)',
      })}`,
    },
    {
      bold: t('other.specialNeedsCheatSheet', {
        defaultValue: 'Cheat sheet for formulas',
      }),
      rest: ` ${t('other.specialNeedsCheatSheetSuffix', {
        defaultValue: 'for written and oral exams',
      })}`,
    },
    {
      bold: t('other.specialNeedsAdditionalTime', {
        defaultValue: '30% additional time for completing exams',
      }),
      rest: `. ${t('other.specialNeedsAdditionalTimeSuffix', {
        defaultValue:
          'Alternatively, for written exams, consider a quantitative (but not qualitative) reduction of the test itself',
      })}`,
    },
    {
      bold: t('other.specialNeedsContentAssessment', {
        defaultValue: 'Assessment of content vs. form',
      }),
      rest: `: ${t('other.specialNeedsContentAssessmentSuffix', {
        defaultValue:
          'prioritize content over form and spelling in the evaluation of tests',
      })}`,
    },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Card spaced={false} style={styles.infoCard}>
        <Text weight="medium" style={styles.infoHeader}>
          {t('other.specialNeedsInfoCardHeader', {
            defaultValue: 'List of compensatory measures granted to',
          })}{' '}
          <Text weight="semibold">{studentFullName}</Text>
        </Text>
        <Col gap={1}>
          {measures.map(measure => (
            <Row key={measure.bold} gap={2}>
              <Text variant="secondaryText">•</Text>
              <Text variant="secondaryText" style={styles.measureText}>
                <Text weight="medium" style={styles.measureBold}>
                  {measure.bold}
                </Text>
                {measure.rest}
              </Text>
            </Row>
          ))}
        </Col>
      </Card>

      <OverviewList dividers indented style={styles.list}>
        <ListItem
          title={t('other.specialNeedsMoreDetails', {
            defaultValue: 'More Details',
          })}
          subtitle={t('other.specialNeedsMoreDetailsSubtitle', {
            defaultValue:
              'Click here to view the list of requests for this course',
          })}
          onPress={showComingSoon}
          leadingItem={
            <Icon icon={faCircleInfo} size={fontSizes.xl} color={iconColor} />
          }
          trailingItem={
            <Icon
              icon={faArrowUpRightFromSquare}
              size={16}
              color={palettes.gray[500]}
            />
          }
        />
        <ListItem
          title={t('other.specialNeedsHandbook', {
            defaultValue: 'Reporting procedure handbook',
          })}
          onPress={showComingSoon}
          leadingItem={
            <Icon
              icon={faFile}
              size={fontSizes.xl}
              color={palettes.darkOrange[600]}
            />
          }
          trailingItem={
            <Icon icon={faChevronRight} size={16} color={palettes.gray[500]} />
          }
        />
      </OverviewList>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ spacing, palettes, fontSizes }: Theme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
    },
    infoCard: {
      marginHorizontal: spacing[5],
      marginBottom: spacing[4],
      padding: spacing[4],
      backgroundColor: palettes.info[100],
      borderWidth: 1,
      borderColor: palettes.info[500],
      elevation: 0,
    },
    infoHeader: {
      fontSize: fontSizes.sm,
      marginBottom: spacing[2],
    },
    measureText: {
      flex: 1,
      fontSize: fontSizes.sm,
    },
    measureBold: {
      fontSize: fontSizes.sm,
    },
    list: {
      marginHorizontal: spacing[5],
    },
  });
