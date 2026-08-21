import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Icon, useKeyboardActivation, useTheme } from '@polito/lib/ui';
import { BookingSeatCell as BookingSeatCellType } from '@polito/student-api-client';

type BookingSeatProps = PressableProps & {
  seat: BookingSeatCellType;
  size: number;
  gap: number;
  isSelected: boolean;
};

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

  const colors = useMemo(() => {
    if (isSelected) {
      return {
        backgroundColor: palettes.tertiary[dark ? 700 : 100],
        borderColor: palettes.tertiary[dark ? 500 : 300],
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
      borderColor: palettes.danger[dark ? 600 : 400],
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
        backgroundColor: colors.backgroundColor,
        borderRadius: shapes.sm / 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.borderColor,
      }}
      {...rest}
      {...keyboardActivationProps}
    >
      {isSelected ? (
        <Icon icon={faCheck} size={size * 0.6} color={colors.borderColor} />
      ) : seat.status !== 'available' ? (
        <Icon icon={faXmark} size={size * 0.6} color={colors.borderColor} />
      ) : null}
    </Pressable>
  );
};
