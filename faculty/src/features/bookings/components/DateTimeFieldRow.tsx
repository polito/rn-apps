import { StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Theme, useStylesheet } from '@polito/lib/ui';

import { DateTimeFieldCard } from './DateTimeFieldCard';

interface Field {
  icon: IconDefinition;
  label: string;
  value: string;
  onPress: () => void;
}

interface Props {
  fields: [Field, Field];
  iconSize?: number;
  chevronSize?: number;
  cardHeight?: number;
}

export const DateTimeFieldRow = ({
  fields,
  iconSize,
  chevronSize,
  cardHeight,
}: Props) => {
  const styles = useStylesheet(createStyles);

  return (
    <View style={styles.row}>
      {fields.map(field => (
        <DateTimeFieldCard
          key={field.label}
          icon={field.icon}
          label={field.label}
          value={field.value}
          onPress={field.onPress}
          iconSize={iconSize}
          chevronSize={chevronSize}
          cardHeight={cardHeight}
        />
      ))}
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
    },
  });
