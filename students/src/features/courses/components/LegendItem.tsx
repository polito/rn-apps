import { StyleSheet, View } from 'react-native';

import { Row, Text, useStylesheet } from '@polito/lib/ui';
import type { Theme } from '@polito/lib/ui';

export const LegendItem = ({
  bulletColor,
  bulletBorderColor,
  text,
  trailingText,
  indented = false,
}: {
  bulletColor?: string;
  bulletBorderColor?: string;
  text: string;
  trailingText?: string;
  indented?: boolean;
}) => {
  const styles = useStylesheet(createStyles);
  return (
    <Row
      gap={2.5}
      style={[styles.chartLegendRow, indented && styles.chartLegendRowIndented]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={[text, trailingText].filter(Boolean).join(', ')}
    >
      {bulletColor && (
        <View
          style={{
            ...styles.chartLegendBullet,
            backgroundColor: bulletColor,
            ...(bulletBorderColor && {
              borderWidth: 2,
              borderColor: bulletBorderColor,
            }),
          }}
        />
      )}
      <Text variant="prose" style={styles.chartLegendText}>
        {text}
      </Text>
      {trailingText && (
        <Text variant="prose" style={styles.chartLegendTrailingText}>
          {trailingText}
        </Text>
      )}
    </Row>
  );
};

const createStyles = ({ spacing, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    chartLegendRow: {
      alignItems: 'center',
      minHeight: 25,
    },
    chartLegendRowIndented: {
      paddingLeft: spacing[9],
    },
    chartLegendBullet: {
      height: spacing[3],
      width: spacing[3],
      borderRadius: spacing[3],
    },
    chartLegendText: {
      flex: 1,
      fontSize: fontSizes.sm,
    },
    chartLegendTrailingText: {
      marginLeft: 'auto',
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
    },
  });
