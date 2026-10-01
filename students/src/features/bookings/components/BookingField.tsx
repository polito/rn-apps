import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  Col,
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';

type BookingDetailProps = {
  icon: IconProp;
  label: string;
  value?: string;
  emptyText?: string;
};

export const BookingField = ({
  icon,
  label,
  value,
  emptyText,
}: BookingDetailProps) => {
  const { palettes } = useTheme();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const fieldValue = value ?? (emptyText || t('common.noValue'));
  return (
    <Col
      flex={1}
      style={styles.container}
      accessible
      importantForAccessibility="no-hide-descendants"
      accessibilityLabel={`${label}: ${fieldValue}`}
    >
      <Row align="center">
        <View {...hideFromScreenReader}>
          <Icon icon={icon} color={palettes.primary['500']} size={16} />
        </View>
        <Text style={styles.text} accessible={false}>
          {label}
        </Text>
      </Row>
      <Row mt={0.5}>
        {value ? (
          <Text
            accessible={false}
            style={StyleSheet.compose(styles.value, styles.withValue)}
          >
            {value}
          </Text>
        ) : (
          <Text
            accessible={false}
            numberOfLines={1}
            style={StyleSheet.compose(styles.empty, styles.value)}
          >
            {emptyText || t('common.noValue')}
          </Text>
        )}
      </Row>
    </Col>
  );
};

const createStyles = ({
  colors,
  fontSizes,
  fontWeights,
  spacing,
  shapes,
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: spacing[2],
      borderRadius: shapes.md,
    },
    value: {
      fontSize: fontSizes.sm,
    },
    withValue: {
      fontWeight: fontWeights.medium,
    },
    text: {
      fontSize: fontSizes.sm,
      marginLeft: spacing[1],
    },
    empty: {
      opacity: 0.6,
    },
  });
