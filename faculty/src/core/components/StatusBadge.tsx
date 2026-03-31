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
};

export const StatusBadge = ({
  text,
  icon,
  backgroundColor,
  borderColor,
  iconColor,
  foregroundColor,
  onPress,
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
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={styles.content}>
        {icon && <Icon icon={icon} size={fontSizes.md} color={iconColor} />}

        <Text
          weight="medium"
          style={{
            color: foregroundColor,
            fontSize: fontSizes.xs,
          }}
        >
          {text}
        </Text>
      </View>

      <View>
        <Icon
          icon={faChevronRight}
          size={fontSizes['2xs']}
          color={foregroundColor}
        />
      </View>
    </Pressable>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: 6,
      borderWidth: 1,
      gap: spacing[5],
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[1],
    },
  });
