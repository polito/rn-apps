import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  Col,
  GlobalStyles,
  Grid,
  Icon,
  Metric,
  Row,
  StatefulMenuView,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { StatisticsFilters } from '../utils/computeStatisticsFilters';

export enum CourseStatisticsFilterType {
  TEACHER = 'teacher',
  YEAR = 'year',
  DEFAULT = 'default',
}

export const CourseStatisticsFilters = ({
  teachers,
  years,
  onTeacherChanged,
  onYearChanged,
  currentYear,
  currentTeacher,
  filterType = CourseStatisticsFilterType.DEFAULT,
}: StatisticsFilters & {
  onTeacherChanged: (teacherId: string) => void;
  onYearChanged: (year: string) => void;
  filterType?: CourseStatisticsFilterType;
}) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  return (
    <Card style={styles.metricsCard} accessible={true}>
      <Grid>
        <View style={GlobalStyles.grow}>
          {(filterType === CourseStatisticsFilterType.YEAR ||
            filterType === CourseStatisticsFilterType.DEFAULT) &&
          years.length > 1 ? (
            <StatefulMenuView
              onPressAction={({ nativeEvent }) => {
                onYearChanged(nativeEvent.event);
              }}
              actions={years}
            >
              <Row justify="flex-start" align="center" style={styles.filterRow}>
                <View style={styles.filterMetricWrap}>
                  <Metric
                    title={t('courseStatisticsScreen.period')}
                    value={currentYear?.title ?? '--'}
                    accessibilityLabel={`${t('courseStatisticsScreen.period')}: ${
                      currentYear?.title ?? '--'
                    }`}
                    style={styles.filterMetric}
                    valueNumberOfLines={1}
                  />
                </View>
                <Col align="center">
                  <Icon
                    icon={faAngleDown}
                    size={14}
                    color={styles.periodDropdownIcon.color}
                    style={styles.periodDropdownChevron}
                  />
                </Col>
              </Row>
            </StatefulMenuView>
          ) : (
            <Row>
              <Metric
                title={t('courseStatisticsScreen.period')}
                value={currentYear?.title ?? '--'}
                accessibilityLabel={`${t('courseStatisticsScreen.period')}: ${
                  currentYear?.title ?? '--'
                }`}
              />
            </Row>
          )}
        </View>
        <View style={GlobalStyles.grow}>
          {filterType === CourseStatisticsFilterType.TEACHER ||
          filterType === CourseStatisticsFilterType.DEFAULT ? (
            <StatefulMenuView
              onPressAction={({ nativeEvent }) => {
                onTeacherChanged(nativeEvent.event);
              }}
              actions={teachers}
            >
              <Row justify="flex-start" align="center" style={styles.filterRow}>
                <View style={styles.filterMetricWrap}>
                  <Metric
                    title={t('courseStatisticsScreen.teacher')}
                    value={currentTeacher?.title ?? '--'}
                    accessibilityLabel={`${t('courseStatisticsScreen.teacher')}: ${
                      currentTeacher?.title ?? '--'
                    }`}
                    style={styles.filterMetric}
                    valueNumberOfLines={1}
                  />
                </View>
                <Col align="center">
                  <Icon
                    icon={faAngleDown}
                    size={14}
                    color={styles.periodDropdownIcon.color}
                    style={styles.periodDropdownChevron}
                  />
                </Col>
              </Row>
            </StatefulMenuView>
          ) : (
            <Row>
              <Metric
                title={t('courseStatisticsScreen.teacher')}
                value={currentTeacher?.title ?? '--'}
                accessibilityLabel={`${t('courseStatisticsScreen.teacher')}: ${
                  currentTeacher?.title ?? '--'
                }`}
              />
            </Row>
          )}
        </View>
      </Grid>
    </Card>
  );
};

const createStyles = ({ spacing, palettes }: Theme) =>
  StyleSheet.create({
    metricsCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      marginTop: spacing[0],
      marginBottom: spacing[5],
    },
    filterRow: {
      flex: 1,
      minWidth: 0,
    },
    filterMetricWrap: {
      flex: 1,
      minWidth: 0,
    },
    filterMetric: {
      marginRight: spacing[2],
    },
    periodDropdownIcon: {
      color: palettes.secondary['500'],
    },
    periodDropdownChevron: {
      marginTop: spacing[4],
    },
  });
