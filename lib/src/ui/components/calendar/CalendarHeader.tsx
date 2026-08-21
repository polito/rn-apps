import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { DateTime } from 'luxon';

import { useTheme } from '../../hooks/useTheme';
import { getHourGuideWidth, isToday } from '../../utils/calendar';
import { Text } from '../Text';

export interface CalendarHeaderProps {
  dateRange: DateTime[];
  cellHeight: number;
  style: ViewStyle;
  onPressDateHeader?: (date: DateTime) => void;
  activeDate?: DateTime;
  hideHours?: boolean;
  locale?: string;
}

export const CalendarHeaderDay = ({
  date,
  cellHeight,
  locale,
  activeDate,
  isLast = false,
  onPress,
}: {
  date: DateTime;
  cellHeight: number;
  locale?: string;
  activeDate?: DateTime;
  isLast?: boolean;
  onPress?: (date: DateTime) => void;
}) => {
  const theme = useTheme();
  const shouldHighlight = activeDate
    ? date.hasSame(activeDate, 'day')
    : isToday(date);

  return (
    <TouchableOpacity
      // Theme-independent hardcoded color
      // eslint-disable-next-line react-native/no-color-literals
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingVertical: theme.spacing[1],
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: !isLast ? theme.colors.divider : 'transparent',
      }}
      onPress={() => onPress?.(date)}
      disabled={onPress === undefined}
      accessibilityRole={onPress ? 'button' : 'header'}
      accessibilityLabel={date
        .setLocale(locale ?? 'en')
        .toFormat('cccc d MMMM')}
      accessibilityState={{ selected: shouldHighlight }}
    >
      <View
        style={[
          {
            height: cellHeight,
            borderRadius: theme.shapes.md,
            paddingHorizontal: theme.spacing[1],
            paddingVertical: theme.spacing[1],
          },
          shouldHighlight && {
            backgroundColor: theme.colors.heading,
          },
        ]}
      >
        <Text
          weight="semibold"
          numberOfLines={2}
          maxFontSizeMultiplier={1.4}
          accessible={false}
          style={[
            {
              fontSize: theme.fontSizes.sm,
              textAlign: 'center',
            },
            shouldHighlight && {
              color: theme.colors.surface,
            },
          ]}
        >
          {date.toLocaleString(
            { weekday: 'short', day: 'numeric' },
            { locale },
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const CalendarHeader = ({
  dateRange,
  cellHeight,
  style,
  onPressDateHeader,
  activeDate,
  hideHours = false,
  locale,
}: CalendarHeaderProps) => {
  const theme = useTheme();

  const borderColor = { borderColor: theme.palettes.gray['200'] };

  return (
    <SafeAreaView
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.divider,
        },
        style,
      ]}
    >
      {!hideHours && (
        <View
          style={[
            {
              width: getHourGuideWidth(),
            },
            borderColor,
          ]}
        />
      )}
      {dateRange.map((date, i) => (
        <CalendarHeaderDay
          key={date.toString()}
          date={date}
          cellHeight={cellHeight}
          locale={locale}
          activeDate={activeDate}
          isLast={i === dateRange.length - 1}
          onPress={onPressDateHeader}
        />
      ))}
    </SafeAreaView>
  );
};
