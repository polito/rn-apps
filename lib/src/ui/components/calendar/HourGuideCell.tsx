import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { DateTime } from 'luxon';

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
}: HourGuideCellProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getCalendarCellStyle = useMemo(
    () =>
      typeof calendarCellStyle === 'function'
        ? calendarCellStyle
        : () => calendarCellStyle,
    [calendarCellStyle],
  );

  const accessibilityLabel = useMemo(() => {
    const dayName = date
      .setLocale(locale ?? 'en')
      .toLocaleString({ weekday: 'long' });
    const hourStr = String(hour).padStart(2, '0') + ':00';
    return `${dayName}, ${hourStr}`;
  }, [date, hour, locale]);

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(date.set({ hour: hour, minute: 0 }))}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={t('agendaScreen.calendarCellHint')}
    >
      <View
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
