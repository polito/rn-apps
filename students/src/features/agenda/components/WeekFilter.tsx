import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@polito/lib';
import { Row } from '@polito/lib';
import { Text } from '@polito/lib';
import { useTheme } from '@polito/lib';

import { DateTime } from 'luxon';

interface Props {
  current: DateTime;
  getNext: () => void;
  getPrev: () => void;
  isPrevWeekDisabled: boolean;
  isNextWeekDisabled: boolean;
  daysPerWeek?: number;
}
export const WeekFilter = ({
  current,
  getNext,
  getPrev,
  isPrevWeekDisabled = false,
  isNextWeekDisabled = false,
  daysPerWeek = 6, // The default setting is 6 days a week because the last day otherwise would be the Monday of the following week
}: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const endOfWeek = useMemo(() => {
    return current.plus({ days: daysPerWeek });
  }, [current, daysPerWeek]);

  return (
    <Row align="center">
      <IconButton
        accessibilityRole="button"
        icon={faChevronLeft}
        accessibilityLabel={t('bookingScreen.previousWeek')}
        color={colors.secondaryText}
        disabled={isPrevWeekDisabled}
        onPress={() => getPrev()}
      />

      <Text style={styles.item}>
        {current.toFormat('d MMM')} - {endOfWeek.toFormat('d MMM')}
      </Text>
      <IconButton
        accessibilityRole="button"
        icon={faChevronRight}
        accessibilityLabel={t('bookingScreen.nextWeek')}
        color={colors.secondaryText}
        disabled={isNextWeekDisabled}
        onPress={() => getNext()}
      />
    </Row>
  );
};

const styles = StyleSheet.create({
  item: {
    fontWeight: '500',
  },
});
