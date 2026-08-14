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
  const { colors, dark, fontFamilies, fontSizes, fontWeights, palettes } =
    useTheme();
  const { accessibility } = usePreferencesContext();
  const color = useMemo(() => {
    if (!inListItem) return dark ? colors.prose : TEXT_SHORT;
    return dark ? palettes.gray[400] : TEXT_SUBTITLE;
  }, [colors.prose, dark, inListItem, palettes.gray]);
  const iconSize = fontSizes.sm;
  const groupGap = inListItem ? 2 : 3;
  const iconTextGap = 1;
  const textStyle = inListItem
    ? {
        fontFamily: fontFamilies.body,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.normal,
        lineHeight: 16,
        color,
      }
    : {
        fontFamily: fontFamilies.body,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: 20,
        color,
      };

  return (
    <>
      <Row
        accessibilityLabel={accessibilityLabel}
        gap={groupGap}
        accessible={accessible}
      >
        <Row gap={iconTextGap} align="center">
          <Icon icon={faCalendar} color={color} size={iconSize} />
          <Text style={textStyle}>{date ?? ''}</Text>
        </Row>
        <Row gap={iconTextGap} align="center">
          {time && Number(accessibility?.fontSize) < 150 && (
            <>
              <Icon icon={faClock} color={color} size={iconSize} />
              <Text style={textStyle}>{time ?? ''}</Text>
            </>
          )}
        </Row>
      </Row>
      {time && Number(accessibility?.fontSize) >= 150 && (
        <Row gap={iconTextGap}>
          <Icon icon={faClock} color={color} size={iconSize} />
          <Text style={textStyle}>{time ?? ''}</Text>
        </Row>
      )}
    </>
  );
};

const TEXT_SHORT = '#525252';
const TEXT_SUBTITLE = '#314158';
