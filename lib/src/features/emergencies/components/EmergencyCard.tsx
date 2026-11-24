import { StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { Icon } from '../../../ui/components/Icon';
import { Row } from '../../../ui/components/Row';
import { Text } from '../../../ui/components/Text';
import { TouchableCard } from '../../../ui/components/TouchableCard';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';

interface Props {
  name: string;
  icon: IconDefinition;
  onPress: () => void;
}

export const EmergencyCard = ({ name, icon, onPress }: Props) => {
  const styles = useStylesheet(createStyles);
  const { dark, palettes } = useTheme();

  return (
    <TouchableCard
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={onPress}
      style={styles.touchable}
      cardStyle={styles.card}
    >
      <Row justify="center" align="center">
        <Icon
          icon={icon}
          size={40}
          color={palettes.primary[dark ? 400 : 500]}
        />
      </Row>
      <Row justify="center" align="baseline">
        <Text variant="title" style={styles.title}>
          {name}
        </Text>
      </Row>
    </TouchableCard>
  );
};

EmergencyCard.minWidth = 96;
EmergencyCard.maxWidth = 184;

const createStyles = ({ spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    touchable: {
      flex: 1,
      height: 96,
      minWidth: EmergencyCard.minWidth,
      maxWidth: EmergencyCard.maxWidth,
    },
    card: {
      flex: 1,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[1],
      justifyContent: 'space-between',
      overflow: 'visible',
    },
    title: {
      fontSize: fontSizes.xs,
      flexShrink: 1,
      textAlign: 'center',
    },
  });
