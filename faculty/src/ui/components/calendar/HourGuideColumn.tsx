import { StyleSheet, View } from 'react-native';

import { isNumber } from 'lodash';

import { Text } from '../../../ui/components/Text';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { Theme } from '../../../ui/types/Theme';
import { formatHour } from '../../../utils/calendar';

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
    <View style={{ height: cellHeight, width: 35 }}>
      <Text
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
