import { StyleSheet, View } from 'react-native';

import { Row, Text, useStylesheet } from '@polito/lib/ui';
import type { Theme } from '@polito/lib/ui';

export const LegendItem = ({
  bulletColor,
  bulletVariant = 'filled',
  text,
  trailingText,
}: {
  bulletColor: string;
  bulletVariant?: 'filled' | 'outlined';
  text: string;
  trailingText?: string;
}) => {
  const styles = useStylesheet(createStyles);
  return (
    <Row gap={2} style={{ alignItems: 'center' }}>
      <View
        style={{
          ...styles.chartLegendBullet,
          backgroundColor:
            bulletVariant === 'outlined' ? undefined : bulletColor,
          borderWidth: bulletVariant === 'outlined' ? 2 : 0,
          borderColor: bulletColor,
        }}
      />
      <Text
        variant="prose"
        style={styles.chartLegendText}
        accessibilityLabel={text}
      >
        {text}
      </Text>
      {trailingText && (
        <Text
          variant="prose"
          style={styles.chartLegendTrailingText}
          accessibilityLabel={trailingText}
        >
          {trailingText}
        </Text>
      )}
    </Row>
  );
};

const createStyles = ({ fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    chartLegendBullet: {
      height: 8,
      width: 8,
      borderRadius: 8,
    },
    chartLegendText: {
      fontSize: fontSizes.xs,
    },
    chartLegendTrailingText: {
      marginLeft: 'auto',
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
    },
  });
