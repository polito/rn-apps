import { ReactElement, useMemo } from 'react';
import { View, ViewProps } from 'react-native';

import { IS_IOS, dateFormatter, hideFromScreenReader } from '@polito/lib/core';
import { ScreenTitle, Text, useTheme } from '@polito/lib/ui';

type Props = ViewProps & {
  title?: string;
  type?: string;
  time?: string | ReactElement;
  endTime?: Date;
  timeLabel?: string;
};

export const EventDetails = ({
  endTime,
  title,
  type,
  time,
  timeLabel,
  accessibilityLabel,
  accessible = true,
  ...rest
}: Props) => {
  const { spacing, fontSizes } = useTheme();
  const formatHHmm = dateFormatter('HH:mm');

  const timeText = useMemo(() => {
    if (!time || typeof time !== 'string') return undefined;
    return `${time}${endTime ? ` - ${formatHHmm(endTime)}` : ''}`;
  }, [endTime, formatHHmm, time]);

  const label = useMemo(
    () =>
      accessibilityLabel ??
      [title, type, timeText, timeLabel].filter(Boolean).join(', '),
    [accessibilityLabel, title, type, timeText, timeLabel],
  );

  const hasCustomTime = time != null && typeof time !== 'string';

  return (
    <View
      style={{ padding: spacing[5] }}
      accessible={accessible}
      accessibilityRole="header"
      accessibilityLabel={accessible ? label : undefined}
      {...rest}
    >
      <View {...hideFromScreenReader}>
        <ScreenTitle style={{ marginBottom: spacing[2] }} title={title} />
      </View>
      {hasCustomTime ? (
        <>
          {type && (
            <Text
              accessible={false}
              variant="caption"
              style={{ marginBottom: spacing[2] }}
            >
              {type}
            </Text>
          )}
          {time}
          {!!timeLabel && (
            <Text accessible={false} style={{ fontSize: fontSizes.md }}>
              {timeLabel}
            </Text>
          )}
        </>
      ) : (
        <View
          importantForAccessibility={
            accessible ? 'no-hide-descendants' : undefined
          }
          accessibilityElementsHidden={accessible ? IS_IOS : undefined}
        >
          {type && (
            <Text
              accessible={false}
              variant="caption"
              style={{ marginBottom: spacing[2] }}
            >
              {type}
            </Text>
          )}
          {timeText && (
            <Text accessible={false} style={{ fontSize: fontSizes.md }}>
              {timeText}
            </Text>
          )}
          {!!timeLabel && (
            <Text accessible={false} style={{ fontSize: fontSizes.md }}>
              {timeLabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
