import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { hideFromScreenReader } from '~/core/accessibility/hideFromScreenReader';

type LegendItem = {
  id: 'available' | 'booked' | 'full' | 'notAvailable' | 'concluded';
  color: string;
};

export const BookingSlotsLegendContent = () => {
  const { t } = useTranslation();
  const { palettes } = useTheme();
  const styles = useStylesheet(createStyles);

  const items: LegendItem[] = [
    { id: 'available', color: palettes.primary['400'] },
    { id: 'booked', color: palettes.tertiary['500'] },
    { id: 'full', color: palettes.danger['500'] },
    { id: 'notAvailable', color: palettes.secondary['400'] },
    { id: 'concluded', color: palettes.gray['400'] },
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
            style={[styles.dot, { backgroundColor: item.color }]}
            {...hideFromScreenReader}
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
    dot: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    label: {
      fontSize: fontSizes.md,
      color: colors.heading,
    },
  });
