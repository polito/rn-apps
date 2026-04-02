import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {
  dateFormatter,
  formatDate,
  formatReadableDate,
  isValidDate,
} from '@polito/lib/core';
import { usePreferencesContext } from '@polito/lib/core';
import { Icon, ListItem, Row, Text, useTheme } from '@polito/lib/ui';

import { AppPreferences } from '~/core/types/preferences';

import { Exam } from '../../core/types/api';

interface Props {
  exam: Exam;
  accessible?: boolean;
  accessibilityLabel?: string;
  bottomBorder?: boolean;
}

export const ExamListItem = ({
  exam,
  accessibilityLabel = '',
  bottomBorder = true,
  ...rest
}: Props) => {
  const { t } = useTranslation();

  const { accessibility } = usePreferencesContext<AppPreferences>();
  const { colors, spacing } = useTheme();
  const formatHHmm = dateFormatter('HH:mm');
  const listItemProps = useMemo(() => {
    let dateTime,
      accessibleDateTime = '';

    const status = t(`common.examStatus.${exam.status}`);

    if (!exam.examStartsAt || !isValidDate(exam?.examStartsAt)) {
      dateTime = t('common.dateToBeDefined');
    } else {
      dateTime = formatDate(exam.examStartsAt);

      if (exam.isTimeToBeDefined) {
        dateTime += `, ${t('common.timeToBeDefined')}`;
        accessibleDateTime = `${dateTime}.`;
      } else {
        const time = formatHHmm(exam.examStartsAt);
        accessibleDateTime += `${dateTime}. ${t('common.time')} ${time}.`;
        dateTime += `, ${time}`;
      }
    }

    return {
      accessibilityLabel: `${accessibilityLabel} ${exam.courseName} ${accessibleDateTime} ${status}`,
    };
  }, [accessibilityLabel, exam, t, formatHHmm]);

  return (
    <View style={{ rowGap: spacing[3] }}>
      <ListItem
        linkTo={{
          screen: 'Exam',
          params: { id: exam.id },
        }}
        title={exam.courseName}
        accessibilityRole="button"
        subtitle={
          accessibility?.fontSize && accessibility.fontSize < 175 ? (
            <Row gap={2.5} pt={1}>
              <Row gap={1} style={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon={faCalendar} color={colors.secondaryText} />
                <Text variant="secondaryText">
                  {exam.examStartsAt && isValidDate(exam?.examStartsAt)
                    ? formatReadableDate(exam.examStartsAt, true)
                    : t('common.dateToBeDefinedShort')}
                </Text>
              </Row>
              {(exam.places?.length ?? 0) > 0 && (
                <Row
                  gap={1}
                  flexShrink={1}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Icon icon={faLocationDot} color={colors.secondaryText} />
                  <Text
                    variant="secondaryText"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flexShrink: 1 }}
                  >
                    {exam.places?.map(place => place.name).join(', ')}
                  </Text>
                </Row>
              )}
            </Row>
          ) : (
            <Row gap={2.5}>
              <Row
                gap={1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                }}
              >
                <Icon icon={faCalendar} color={colors.secondaryText} />
                <Text variant="secondaryText">
                  {exam.examStartsAt && isValidDate(exam?.examStartsAt)
                    ? exam?.examStartsAt.getDate() === new Date().getDate()
                      ? t('common.today')
                      : formatDate(exam.examStartsAt)
                    : t('common.dateToBeDefinedShort')}
                </Text>
              </Row>
              {(exam.places?.length ?? 0) > 0 && (
                <Row
                  gap={1}
                  flexShrink={1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Icon icon={faLocationDot} color={colors.secondaryText} />
                  <Text
                    variant="secondaryText"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flexShrink: 1 }}
                  >
                    {exam.places?.map(place => place.name).join(', ')}
                  </Text>
                </Row>
              )}
            </Row>
          )
        }
        {...listItemProps}
        {...rest}
      />

      {bottomBorder &&
        accessibility?.fontSize &&
        accessibility.fontSize > 150 && (
          <View
            style={{
              height: 1,
              backgroundColor: colors.divider,
              marginHorizontal: spacing[4],
            }}
          />
        )}
    </View>
  );
};
