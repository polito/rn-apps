import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { Exam } from '../../core/types/api';
import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { Row } from '../../ui/components/Row';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';
import {
  dateFormatter,
  formatDate,
  formatReadableDate,
  isValidDate,
} from '../../utils/dates';

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

  const { accessibility } = usePreferencesContext();
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
