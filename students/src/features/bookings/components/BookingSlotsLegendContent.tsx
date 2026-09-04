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

import { BookingSlotIcon } from './BookingSlotIcon';

type LegendItem = {
  id: 'available' | 'booked' | 'full' | 'notAvailable' | 'concluded';
  color: string;
  icon: IconDefinition;
};

export const BookingSlotsLegendContent = () => {
  const { t } = useTranslation();
  const { palettes, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  const items: LegendItem[] = [
    { id: 'available', color: palettes.primary['400'], icon: faSeat },
    { id: 'booked', color: palettes.tertiary['500'], icon: faSeatCheck },
    { id: 'full', color: palettes.danger['500'], icon: faSeatFull },
    {
      id: 'notAvailable',
      color: palettes.secondary['400'],
      icon: faSeatClock,
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
          <BookingSlotIcon
            icon={item.icon}
            color={item.color}
            size={fontSizes.lg}
          />
        </View>
      ))}
    </View>
  );
};

const createStyles = ({ spacing, fontSizes, colors }: Theme) =>
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
    label: {
      fontSize: fontSizes.md,
      color: colors.heading,
    },
  });
