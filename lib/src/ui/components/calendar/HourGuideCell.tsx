import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { DateTime } from 'luxon';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { useTheme } from '../../hooks/useTheme';
import { CalendarCellStyle } from '../../types/Calendar';

interface HourGuideCellProps {
  cellHeight: number;
  onPress: (d: DateTime) => void;
  date: DateTime;
  hour: number;
  index: number;
  calendarCellStyle?: CalendarCellStyle;
  showBorderRight?: boolean;
  showBorderBottom?: boolean;
  locale?: string;
  accessibleCell?: boolean;
}

export const HourGuideCell = ({
  cellHeight,
  onPress,
  date,
  hour,
  index,
  calendarCellStyle,
  showBorderRight = false,
  showBorderBottom = false,
  locale,
  accessibleCell = false,
}: HourGuideCellProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const accessibilityProps = useMemo(() => {
    if (!accessibleCell) return hideFromScreenReader;

    const hourLabel = `${String(hour).padStart(2, '0')}:00`;
    return {
      accessible: true,
      accessibilityLabel: [
        date.setLocale(locale ?? 'en').toLocaleString({ weekday: 'long' }),
        t('common.atTime', { time: hourLabel }),
        t('bookingsScreen.emptySlot'),
      ].join(', '),
    };
  }, [accessibleCell, date, hour, locale, t]);

  const getCalendarCellStyle = useMemo(
    () =>
      typeof calendarCellStyle === 'function'
        ? calendarCellStyle
        : () => calendarCellStyle,
    [calendarCellStyle],
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(date.set({ hour: hour, minute: 0 }))}
      {...accessibilityProps}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          {
            borderColor: theme.colors.divider,
            borderRightWidth: showBorderRight ? StyleSheet.hairlineWidth : 0,
            borderBottomWidth: showBorderBottom ? StyleSheet.hairlineWidth : 0,
          },
          { height: cellHeight },
          { ...getCalendarCellStyle(date, index) },
        ]}
      />
    </TouchableWithoutFeedback>
  );
};
