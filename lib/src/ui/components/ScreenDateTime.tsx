import { useMemo } from 'react';

import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';
import { Row } from './Row';
import { Text } from './Text';

interface Props {
  accessible?: boolean;
  date?: string;
  time?: string;
  inListItem?: boolean;
  accessibilityLabel?: string;
}

export const ScreenDateTime = ({
  accessible,
  accessibilityLabel,
  date,
  time,
  inListItem = false,
}: Props) => {
  const { colors, dark, fontSizes, palettes } = useTheme();
  const { accessibility } = usePreferencesContext();
  const color = useMemo(() => {
    if (!inListItem) return colors.prose;
    return dark ? palettes.gray[400] : palettes.gray[500];
  }, [colors.prose, dark, inListItem, palettes.gray]);

  return (
    <>
      <Row
        accessibilityLabel={accessibilityLabel}
        gap={3}
        accessible={accessible}
      >
        <Row gap={2} align="center">
          <Icon icon={faCalendar} color={color} size={fontSizes.md} />
          <Text style={{ fontSize: fontSizes.md, color }}>{date ?? ''}</Text>
        </Row>
        <Row gap={2} align="center">
          {time && Number(accessibility?.fontSize) < 150 && (
            <>
              <Icon icon={faClock} color={color} size={fontSizes.md} />
              <Text style={{ fontSize: fontSizes.md, color }}>
                {time ?? ''}
              </Text>
            </>
          )}
        </Row>
      </Row>
      {time && Number(accessibility?.fontSize) >= 150 && (
        <Row>
          <Icon icon={faClock} color={color} size={fontSizes.md} />
          <Text style={{ fontSize: fontSizes.md, color }}>{time ?? ''}</Text>
        </Row>
      )}
    </>
  );
};
