import { StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Col } from './Col';
import { Icon } from './Icon';
import { Text } from './Text';

interface Props {
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
}: Props) => {
  const { colors, fontSizes, spacing: _spacing } = useTheme();
  const styles = useStylesheet(createStyles);

  return (
    <Col
      accessibilityRole="text"
      accessible={true}
      accessibilityLabel={[message, caption].filter(Boolean).join('. ')}
      align="center"
      style={{
        padding: _spacing[spacing as unknown as keyof Theme['spacing']],
      }}
    >
      {icon && (
        <Icon
          icon={icon}
          color={iconColor ?? colors.tabBarInactive}
          size={iconSize || fontSizes['3xl']}
          style={styles.icon}
        />
      )}
      <Text
        style={{ textAlign: 'center' }}
        variant="secondaryText"
        weight="semibold"
      >
        {message}
      </Text>
      {caption && (
        <Text
          style={{ textAlign: 'center', fontSize: fontSizes.sm }}
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
