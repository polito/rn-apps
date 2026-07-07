import { useMemo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { hideFromScreenReader } from '../../core/accessibility/hideFromScreenReader';
import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Col } from './Col';
import { Icon } from './Icon';
import { Text } from './Text';

interface Props extends ViewProps {
  icon?: IconDefinition;
  iconColor?: string;
  iconSize?: number;
  message: string;
  caption?: string;
  spacing?: number;
}

export const EmptyState = ({
  icon,
  iconColor,
  message,
  caption,
  spacing = 12,
  iconSize,
  accessibilityLabel,
  accessible = true,
  ...rest
}: Props) => {
  const { colors, fontSizes, spacing: _spacing } = useTheme();
  const styles = useStylesheet(createStyles);

  const label = useMemo(
    () => accessibilityLabel ?? [message, caption].filter(Boolean).join(', '),
    [accessibilityLabel, message, caption],
  );

  return (
    <Col
      accessible={accessible}
      accessibilityRole="none"
      accessibilityLabel={accessible ? label : undefined}
      align="center"
      style={{
        padding: _spacing[spacing as unknown as keyof Theme['spacing']],
      }}
      {...rest}
    >
      {icon && (
        <View {...hideFromScreenReader}>
          <Icon
            icon={icon}
            color={iconColor ?? colors.secondaryText}
            size={iconSize || fontSizes['3xl']}
            style={styles.icon}
          />
        </View>
      )}
      <Text
        accessible={false}
        style={{ textAlign: 'center' }}
        variant="secondaryText"
      >
        {message}
      </Text>
      {caption && (
        <Text
          accessible={false}
          style={{ textAlign: 'center', fontSize: fontSizes.xs }}
          variant="secondaryText"
        >
          {caption}
        </Text>
      )}
    </Col>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    icon: {
      marginBottom: spacing[4],
    },
  });
