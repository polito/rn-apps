import React, { JSX } from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card, CardProps } from './Card';

interface Metric {
  name: string;
  value: string | number | JSX.Element;
}

interface Props {
  metrics: Metric[];       // Array di coppie name-value (prima riga)
  metrics2?: Metric[];     // Seconda riga opzionale
  style?: ViewStyle;       // Stile opzionale
}

/**
 * A card used to present multiple metrics with a caption.
 */
export const MetricCard = ({
  metrics,
  metrics2,
  style,
  ...rest
}: CardProps & Props) => {
  const { colors, spacing, fontSizes, fontWeights } = useTheme();

  const renderMetricRow = (data: Metric[], rowIndex: number) => (
    <View key={rowIndex} style={styles.metricRow}>
      {data.map((metric, index) => (
        <View key={index} style={styles.metricColumn}>
          <Text style={{ color: colors.secondaryText, marginBottom: spacing[1]  }}>
            {metric.name}
          </Text>
          {['string', 'number'].includes(typeof metric.value) ? (
            <Text
              style={{
                color: colors.prose,
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.semibold,
              }}
            >
              {metric.value}
            </Text>
          ) : (
            metric.value
          )}
        </View>
      ))}
    </View>
  );

  return (
    <Card
      style={[
        {
          flex: 1,
          padding: spacing[5] ,
        },
        style,
      ]}
      {...rest}
    >
      {renderMetricRow(metrics, 0)}
      {metrics2 && renderMetricRow(metrics2, 1)}
    </Card>
  );
};

// Stili per la visualizzazione delle metriche
const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
});
