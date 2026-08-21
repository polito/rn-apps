import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewStyle } from 'react-native';

import {
  CalendarTouchableOpacityProps,
  EventCellStyle,
  ICalendarEventBase,
} from '../../types/Calendar';

interface UseCalendarTouchableOpacityPropsProps<T extends ICalendarEventBase> {
  event: T;
  eventCellStyle?: EventCellStyle<T>;
  onPressEvent?: (event: T) => void;
  injectedStyles?: ViewStyle[];
}

export function useCalendarTouchableOpacityProps<T extends ICalendarEventBase>({
  event,
  eventCellStyle,
  injectedStyles = [],
  onPressEvent,
}: UseCalendarTouchableOpacityPropsProps<T>) {
  const { t } = useTranslation();
  const getEventStyle = useMemo(
    () =>
      typeof eventCellStyle === 'function'
        ? eventCellStyle
        : () => eventCellStyle,
    [eventCellStyle],
  );

  const _onPress = useCallback(() => {
    onPressEvent && onPressEvent(event);
  }, [onPressEvent, event]);

  const accessibilityLabel = [
    event.title || t('common.event'),
    event.start.toFormat('cccc d MMMM'),
    `${t('common.fromTime')} ${event.start.toFormat('HH:mm')} ${t('common.toTime')} ${event.end.toFormat('HH:mm')}`,
  ].join(', ');

  const touchableOpacityProps: CalendarTouchableOpacityProps = {
    delayPressIn: 20,
    style: [...injectedStyles, getEventStyle(event)],
    onPress: _onPress,
    disabled: !onPressEvent,
    accessible: true,
    accessibilityLabel,
    focusable: !!onPressEvent,
  };

  return touchableOpacityProps;
}
