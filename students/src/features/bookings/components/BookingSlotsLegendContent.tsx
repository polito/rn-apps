import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  Text,
  Theme,
  faSeat,
  faSeatCheck,
  faSeatClock,
  faSeatFull,
  faSeatOutline,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { DARK_SLOT_BACKGROUNDS } from '../../../utils/bookings';
import { BookingSlotIcon } from './BookingSlotIcon';

type LegendItem = {
  id: 'available' | 'booked' | 'full' | 'notAvailable' | 'concluded';
  color: string;
  icon: IconDefinition;
  backgroundColor?: string;
};

export const BookingSlotsLegendContent = () => {
  const { t } = useTranslation();
  const { palettes, fontSizes, dark } = useTheme();
  const styles = useStylesheet(createStyles);

  const items: LegendItem[] = [
    {
      id: 'available',
      color: palettes.primary[dark ? '50' : '600'],
      icon: faSeat,
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.available
        : palettes.primary['50'],
    },
    {
      id: 'booked',
      color: palettes.tertiary[dark ? '200' : '700'],
      icon: faSeatCheck,
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.booked
        : palettes.tertiary['100'],
    },
    {
      id: 'full',
      color: palettes.danger[dark ? '200' : '800'],
      icon: faSeatFull,
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.full
        : palettes.danger['200'],
    },
    {
      id: 'notAvailable',
      color: palettes.secondary[dark ? '200' : '800'],
      icon: faSeatClock,
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.notYetBookable
        : palettes.secondary['100'],
    },
    { id: 'concluded', color: palettes.gray['400'], icon: faSeatOutline },
  ];

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[styles.row, index === items.length - 1 && styles.lastRow]}
        >
          <Text style={styles.label}>
            {t(`bookingScreen.bookingStatus.${item.id}`)}
          </Text>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            <BookingSlotIcon
              icon={item.icon}
              color={item.color}
              size={fontSizes.lg}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, colors, shapes }: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
      gap: spacing[3],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[2],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    iconContainer: {
      padding: spacing[1.5],
      borderRadius: shapes.sm / 2,
    },
    label: {
      fontSize: fontSizes.md,
      color: colors.heading,
    },
  });
