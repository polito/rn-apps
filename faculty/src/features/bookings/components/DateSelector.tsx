import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { Text, Theme, useStylesheet } from '@polito/lib/ui';

import { DateTime } from 'luxon';

export const DATE_SELECTOR_CHIP_SIZE = 48;
export const DATE_SELECTOR_CHIP_GAP = 12;
export const DATE_SELECTOR_HORIZONTAL_PADDING = 18;
/** Selectable days: Mon–Sat (Sun closed). */
export const DATE_SELECTOR_WEEKDAY_COUNT = 6;

interface Props {
  days: DateTime[];
  selectedDate: DateTime;
  onSelectDate: (date: DateTime) => void;
}

const chunkWeeks = (days: DateTime[]) => {
  const weeks: DateTime[][] = [];
  for (let i = 0; i < days.length; i += DATE_SELECTOR_WEEKDAY_COUNT) {
    weeks.push(days.slice(i, i + DATE_SELECTOR_WEEKDAY_COUNT));
  }
  return weeks;
};

export const DateSelector = forwardRef<ScrollView, Props>(
  ({ days, selectedDate, onSelectDate }, ref) => {
    const { i18n } = useTranslation();
    const styles = useStylesheet(createStyles);
    const { width: windowWidth } = useWindowDimensions();

    const weeks = useMemo(() => chunkWeeks(days), [days]);

    return (
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        style={styles.scroll}
      >
        {weeks.map(week => (
          <View
            key={week[0]?.toISODate() ?? 'week'}
            style={[styles.weekPage, { width: windowWidth }]}
          >
            {week.map(day => {
              const selected = day.hasSame(selectedDate, 'day');
              return (
                <Pressable
                  key={day.toISODate()}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onSelectDate(day)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text
                    style={[styles.weekday, selected && styles.weekdaySelected]}
                    numberOfLines={1}
                  >
                    {day.setLocale(i18n.language).toFormat('EEE').toUpperCase()}
                  </Text>
                  <Text
                    style={[styles.number, selected && styles.numberSelected]}
                    numberOfLines={1}
                  >
                    {day.toFormat('d')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    );
  },
);

DateSelector.displayName = 'DateSelector';

const TEXT_SHORT = '#525252';
const TEXT_SUBTITLE = '#314158';
const LINK_BLUE = '#006DB4';
const TAG_NAVY_BG = '#DCF3FF';
const TAG_NAVY_BORDER = '#6DD7FF';
const DIVIDER = '#E2E8F0';
const SURFACE = '#FFF';

const createStyles = ({ dark, colors, fontFamilies, fontWeights }: Theme) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 0,
    },
    weekPage: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: DATE_SELECTOR_HORIZONTAL_PADDING,
    },
    chip: {
      width: DATE_SELECTOR_CHIP_SIZE,
      height: DATE_SELECTOR_CHIP_SIZE,
      paddingVertical: 6,
      paddingHorizontal: 8,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: dark ? colors.divider : DIVIDER,
      backgroundColor: dark ? colors.surface : SURFACE,
    },
    chipSelected: {
      backgroundColor: dark ? colors.surface : TAG_NAVY_BG,
      borderColor: TAG_NAVY_BORDER,
    },
    weekday: {
      fontFamily: fontFamilies.title,
      fontSize: 10,
      fontWeight: fontWeights.medium,
      lineHeight: 15,
      letterSpacing: -0.5,
      textAlign: 'center',
      textTransform: 'uppercase',
      color: dark ? colors.secondaryText : TEXT_SHORT,
      marginTop: 2,
    },
    weekdaySelected: {
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.semibold,
      color: LINK_BLUE,
    },
    number: {
      fontFamily: fontFamilies.title,
      fontSize: 18,
      fontWeight: fontWeights.medium,
      textAlign: 'center',
      color: dark ? colors.title : TEXT_SUBTITLE,
    },
    numberSelected: {
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.semibold,
      color: LINK_BLUE,
    },
  });
