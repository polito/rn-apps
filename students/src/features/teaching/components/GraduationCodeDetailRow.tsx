import { Pressable, StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  Icon,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { usePressableFeedback } from '~/core/hooks/usePressableFeedback';

type Props = {
  icon: IconDefinition;
  value: string;
  accessibilityLabel: string;
  trailingIcon?: IconDefinition;
  onPressTrailing?: () => void;
  trailingAccessibilityLabel?: string;
};

export const GraduationCodeDetailRow = ({
  icon,
  value,
  accessibilityLabel,
  trailingIcon,
  onPressTrailing,
  trailingAccessibilityLabel,
}: Props) => {
  const { colors, fontSizes } = useTheme();
  const pressableFeedback = usePressableFeedback();
  const styles = useStylesheet(createStyles);

  return (
    <Row gap={3} align="center" style={styles.row}>
      <Icon icon={icon} size={fontSizes.xl} color={colors.title} />
      <Text
        variant="prose"
        style={styles.value}
        weight="medium"
        accessibilityLabel={accessibilityLabel}
      >
        {value}
      </Text>
      {trailingIcon && onPressTrailing && (
        <Pressable
          onPress={onPressTrailing}
          android_ripple={pressableFeedback.androidRipple}
          style={pressableFeedback.style(styles.trailingButton)}
          accessibilityRole="button"
          accessibilityLabel={trailingAccessibilityLabel}
        >
          <Icon icon={trailingIcon} size={fontSizes.lg} color={colors.title} />
        </Pressable>
      )}
    </Row>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    row: {
      minHeight: spacing[8],
    },
    value: {
      flex: 1,
      flexShrink: 1,
    },
    trailingButton: {
      padding: spacing[2],
      borderRadius: spacing[2],
      // Clips the Android ripple to the rounded corners
      overflow: 'hidden',
    },
  });
