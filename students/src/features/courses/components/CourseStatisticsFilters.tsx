import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
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
                <View style={styles.filterValueWrap}>
                  <Metric
                    title={t('courseStatisticsScreen.period')}
                    value={currentYear?.title ?? '--'}
                    accessibilityLabel={`${t('courseStatisticsScreen.period')}: ${
                      currentYear?.title ?? '--'
                    }`}
                    valueStyle={styles.dropdownText}
                    valueNumberOfLines={1}
                  />
                </View>
                <Icon icon={faChevronDown} style={styles.chevronIcon} />
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
                valueStyle={styles.dropdownText}
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
              <Row align="center" style={styles.filterRow}>
                <View style={styles.filterValueWrap}>
                  <Metric
                    title={t('courseStatisticsScreen.teacher')}
                    value={currentTeacher?.title ?? '--'}
                    accessibilityLabel={`${t('courseStatisticsScreen.teacher')}: ${
                      currentTeacher?.title ?? '--'
                    }`}
                    valueStyle={styles.dropdownText}
                    valueNumberOfLines={1}
                  />
                </View>
                <Icon icon={faChevronDown} style={styles.chevronIcon} />
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
                valueStyle={styles.dropdownText}
              />
            </Row>
          )}
        </View>
      </Grid>
    </Card>
  );
};

const createStyles = ({ spacing, fontSizes, colors }: Theme) =>
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
    filterValueWrap: {
      flex: 1,
      minWidth: 0,
      marginRight: spacing[2],
    },
    dropdownText: {
      color: colors.prose,
      fontSize: fontSizes.lg,
    },
    chevronIcon: {
      flexShrink: 0,
      alignSelf: 'center',
    },
  });
