import { StyleSheet, View } from 'react-native';

import { Row, Text, useStylesheet } from '@polito/lib/ui';
import type { Theme } from '@polito/lib/ui';

export const LegendItem = ({
  bulletColor,
  text,
  trailingText,
  trailingPercent,
}: {
  bulletColor: string;
  text: string;
  trailingText?: string;
  trailingPercent?: string;
}) => {
  const styles = useStylesheet(createStyles);
  return (
    <Row gap={2} style={{ alignItems: 'center' }}>
      <View
        style={{
          ...styles.chartLegendBullet,
          backgroundColor: bulletColor,
        }}
      />
      <Text
        variant="prose"
        style={styles.chartLegendText}
        accessibilityLabel={text}
      >
        {text}
      </Text>
      {trailingPercent ? (
        <Row gap={1} align="baseline" style={styles.chartLegendTrailingGroup}>
          {trailingText && (
            <Text
              variant="prose"
              style={styles.chartLegendTrailingText}
              accessibilityLabel={trailingText}
            >
              {trailingText}
            </Text>
          )}
          <Text
            variant="secondaryText"
            style={styles.chartLegendPercent}
            accessibilityLabel={trailingPercent}
          >
            {trailingPercent}
          </Text>
        </Row>
      ) : (
        trailingText && (
          <Text
            variant="prose"
            style={[
              styles.chartLegendTrailingText,
              styles.chartLegendTrailingEnd,
            ]}
            accessibilityLabel={trailingText}
          >
            {trailingText}
          </Text>
        )
      )}
    </Row>
  );
};

const createStyles = ({ fontSizes, fontWeights, colors }: Theme) =>
  StyleSheet.create({
    chartLegendBullet: {
      height: 8,
      width: 8,
      borderRadius: 8,
    },
    chartLegendText: {
      fontSize: fontSizes.xs,
    },
    chartLegendTrailingGroup: {
      marginLeft: 'auto',
    },
    chartLegendTrailingEnd: {
      marginLeft: 'auto',
    },
    chartLegendTrailingText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
    chartLegendPercent: {
      color: colors.secondaryText,
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.5,
    },
  });
