import { StyleSheet, TouchableHighlight } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  Icon,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

type Props = {
  icon: IconDefinition;
  value: string;
  accessibilityLabel: string;
  onPress?: () => void;
};

export const GraduationCodeDetailRow = ({
  icon,
  value,
  accessibilityLabel,
  onPress,
}: Props) => {
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  const content = (
    <Row
      gap={3}
      align="center"
      style={styles.row}
      accessible={!onPress}
      accessibilityLabel={onPress ? undefined : accessibilityLabel}
    >
      <Icon icon={icon} size={fontSizes.xl} color={colors.title} />
      <Text variant="prose" style={styles.value} weight="medium">
        {value}
      </Text>
    </Row>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colors.touchableHighlight}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {content}
    </TouchableHighlight>
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
  });
