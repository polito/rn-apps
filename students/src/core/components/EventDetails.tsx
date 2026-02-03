import { ReactElement } from 'react';
import { View, ViewProps } from 'react-native';

import { dateFormatter } from '@polito/lib';
import { ScreenTitle } from '@polito/lib';
import { Text } from '@polito/lib';
import { useTheme } from '@polito/lib';

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
  ...rest
}: Props) => {
  const { spacing, fontSizes } = useTheme();
  const formatHHmm = dateFormatter('HH:mm');
  return (
    <View style={{ padding: spacing[5] }} {...rest}>
      <ScreenTitle style={{ marginBottom: spacing[2] }} title={title} />
      <Text variant="caption" style={{ marginBottom: spacing[2] }}>
        {type}
      </Text>
      {time &&
        (typeof time === 'string' ? (
          <Text style={{ fontSize: fontSizes.md }}>
            {time}
            {endTime && ` - ${formatHHmm(endTime)}`}
          </Text>
        ) : (
          time
        ))}
      {!!timeLabel && (
        <Text style={{ fontSize: fontSizes.md }}>{timeLabel}</Text>
      )}
    </View>
  );
};
