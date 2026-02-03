import { StyleSheet, View } from 'react-native';

import { Row } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import type { Theme } from '@polito/lib';

export const LegendItem = ({
  bulletColor,
  text,
  trailingText,
}: {
  bulletColor: string;
  text: string;
  trailingText?: string;
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
