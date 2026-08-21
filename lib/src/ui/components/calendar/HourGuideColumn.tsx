import { StyleSheet, View } from 'react-native';

import { isNumber } from 'lodash';

import { useStylesheet } from '../../hooks/useStylesheet';
import { Theme } from '../../types/Theme';
import { formatHour, getHourGuideWidth } from '../../utils/calendar';
import { Text } from '../Text';

interface HourGuideColumnProps {
  cellHeight: number;
  hour?: string | number;
  ampm: boolean;
  centerVertically?: boolean;
}

export const HourGuideColumn = ({
  cellHeight,
  hour,
  ampm,
  centerVertically = true,
}: HourGuideColumnProps) => {
  const styles = useStylesheet(createStyles);

  return (
    <View style={{ height: cellHeight, width: getHourGuideWidth() }}>
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.4}
        style={[
          styles.hourLabel,
          centerVertically && {
            position: 'absolute',
            top: -6,
          },
        ]}
      >
        {isNumber(hour) ? formatHour(hour, ampm) : hour}
      </Text>
    </View>
  );
};

const createStyles = ({ palettes, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    hourLabel: {
      textAlign: 'center',
      width: '100%',
      color: palettes.gray[500],
      fontSize: fontSizes['2xs'],
      fontWeight: fontWeights.medium,
    },
  });
