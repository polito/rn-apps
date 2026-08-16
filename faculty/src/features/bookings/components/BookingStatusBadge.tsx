import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Badge, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { getBadgeStyle, getStatusLabel } from '../utils/bookingStatus';

interface Props {
  status: string;
  style?: StyleProp<ViewStyle>;
}

export const BookingStatusBadge = ({ status, style }: Props) => {
  const { t } = useTranslation();
  const { dark, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const badge = getBadgeStyle(status, dark, palettes);

  return (
    <Badge
      text={getStatusLabel(status, t)}
      backgroundColor={badge.backgroundColor}
      foregroundColor={badge.foregroundColor}
      icon={badge.icon}
      style={[styles.badge, style]}
    />
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    badge: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[2.5],
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing[1.5],
      borderRadius: 20,
      borderWidth: 0,
    },
  });
