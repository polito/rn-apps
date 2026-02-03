import { View, ViewProps } from 'react-native';
import { ProgressChart as RNCKProgressChart } from 'react-native-chart-kit';

import { usePreferencesContext } from '@polito/lib';
import { uniformInsets } from '@polito/lib';
import { Col } from '@polito/lib';
import { Text } from '@polito/lib';
import { useTheme } from '@polito/lib';

import { AppPreferences } from '~/core/types/preferences';

import color from 'color';

type Props = ViewProps & {
  data: number[];
  label?: string;
  colors: string[];
  boxSize?: number;
  thickness?: number;
  radius?: number;
};

export const ProgressChart = ({
  data,
  colors,
  label,
  boxSize = 125,
  thickness = 16,
  radius = 30,
  ...rest
}: Props) => {
  const { dark, colors: themeColors, palettes, fontSizes } = useTheme();
  const { accessibility } = usePreferencesContext<AppPreferences>();
  return (
    <View accessible={false} {...rest}>
      <RNCKProgressChart
        data={{
          data: [1],
        }}
        width={boxSize}
        height={boxSize}
        hideLegend={true}
        strokeWidth={thickness}
        radius={radius}
        style={{
          margin: -20,
        }}
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: () =>
            color(palettes.primary[500])
              .alpha(dark ? 0.3 : 0.08)
              .toString(),
        }}
      />
      {data.map((i, index) => (
        <RNCKProgressChart
          key={index}
          data={{
            data: [i],
          }}
          width={boxSize}
          height={boxSize}
          hideLegend={true}
          strokeWidth={thickness}
          radius={radius}
          style={{
            margin: -20,
            position: 'absolute',
          }}
          chartConfig={{
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) =>
              color(colors[index]).alpha(Math.round(opacity)).toString(),
          }}
        />
      ))}
      {label && (
        <Col
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            ...uniformInsets(0),
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.xs,
              color: themeColors.secondaryText,
              textAlign: 'center',
              fontWeight:
                accessibility?.fontSize && accessibility.fontSize >= 150
                  ? '600'
                  : undefined,
            }}
          >
            {label}
          </Text>
        </Col>
      )}
    </View>
  );
};
