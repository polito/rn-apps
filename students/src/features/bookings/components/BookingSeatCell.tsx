import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, PressableProps } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';
import { Icon, useKeyboardActivation, useTheme } from '@polito/lib/ui';
import { BookingSeatCell as BookingSeatCellType } from '@polito/student-api-client';

type BookingSeatProps = PressableProps & {
  seat: BookingSeatCellType;
  size: number;
  gap: number;
  isSelected: boolean;
};

const ICON_SIZE_RATIO = 0.6;

export const BookingSeatCell = ({
  seat,
  size,
  gap,
  isSelected,
  ...rest
}: BookingSeatProps) => {
  const { t } = useTranslation();
  const { palettes, shapes, dark } = useTheme();
  const seatStatus = t(`bookingSeatScreen.seatStatus.${seat.status}`);

  const { backgroundColor, borderColor, icon, iconColor } = useMemo<{
    backgroundColor: string;
    borderColor: string;
    icon?: IconDefinition;
    iconColor?: string;
  }>(() => {
    if (isSelected) {
      return {
        backgroundColor: palettes.tertiary[dark ? 700 : 100],
        borderColor: palettes.tertiary[600],
        icon: faCircleCheck,
        iconColor: palettes.tertiary[dark ? 100 : 600],
      };
    }
    if (seat.status === 'available') {
      return {
        backgroundColor: palettes.primary[dark ? 500 : 50],
        borderColor: palettes.primary[dark ? 400 : 300],
      };
    }
    return {
      backgroundColor: dark
        ? palettes.danger[800] + 'CC'
        : palettes.danger[200],
      borderColor: palettes.danger[600],
      icon: faCircleXmark,
      iconColor: palettes.danger[dark ? 200 : 600],
    };
  }, [
    isSelected,
    seat.status,
    palettes.danger,
    palettes.tertiary,
    palettes.primary,
    dark,
  ]);

  const keyboardActivationProps = useKeyboardActivation({
    onActivate: rest.onPress as (() => void) | undefined,
    disabled: seat.status !== 'available',
    accessibilityActions: rest.accessibilityActions,
    onAccessibilityAction: rest.onAccessibilityAction,
  });

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={[seat.label, seatStatus].join(', ')}
      accessibilityState={{
        selected: isSelected,
        disabled: seat.status !== 'available' || !!rest.disabled,
      }}
      hitSlop={Math.max(0, Math.min((24 - size) / 2, gap / 2))}
      style={{
        height: size,
        width: size,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderRadius: shapes.sm / 2,
        borderWidth: 1,
        borderColor,
      }}
      {...rest}
      {...keyboardActivationProps}
    >
      {icon && (
        <Icon icon={icon} color={iconColor} size={size * ICON_SIZE_RATIO} />
      )}
    </Pressable>
  );
};
