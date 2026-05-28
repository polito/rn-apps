import { Pressable, StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Icon, Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

type Props = {
  text: string;
  icon?: IconDefinition;
  backgroundColor: string;
  foregroundColor: string;
  borderColor?: string;
  iconColor?: string;
  onPress?: () => void;
  style?: any;
  isAction?: boolean;
  variant?: 'filled' | 'void';
};

export const StatusBadge = ({
  text,
  icon,
  backgroundColor,
  borderColor,
  iconColor,
  foregroundColor,
  onPress,
  style,
  isAction,
  variant = 'filled',
}: Props) => {
  const { fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={styles.content}>
        {icon && <Icon icon={icon} size={fontSizes.md} color={iconColor} />}

        {variant === 'filled' && (
          <Text
            weight="semibold"
            style={{
              color: foregroundColor,
              fontSize: fontSizes.xs,
              fontFamily: 'Montserrat-SemiBold',
            }}
          >
            {text}
          </Text>
        )}
      </View>

      {isAction && (
        <View>
          <Icon
            icon={faChevronRight}
            size={fontSizes['2xs']}
            color={foregroundColor}
          />
        </View>
      )}
    </Pressable>
  );
};

const createStyles = ({ spacing, shapes }: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: shapes.xl,
      paddingLeft: spacing[1.5],
      paddingRight: spacing[2],
      paddingVertical: spacing[1],
      gap: spacing[1.5],
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[1],
    },
  });
