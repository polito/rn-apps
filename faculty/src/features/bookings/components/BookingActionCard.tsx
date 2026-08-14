import { StyleSheet, View } from 'react-native';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  Text,
  Theme,
  TouchableCard,
  useStylesheet,
} from '@polito/lib/ui';

interface Props {
  label: string;
  title: string;
  onPress: () => void;
}

export const BookingActionCard = ({ label, title, onPress }: Props) => {
  const styles = useStylesheet(createStyles);

  return (
    <TouchableCard
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${label}`}
      onPress={onPress}
      style={styles.touchable}
      cardStyle={styles.card}
    >
      <View style={styles.textContainer}>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.iconButton}>
          <Icon icon={faPaperPlane} size={12} color={BUTTON_PRIMARY} />
        </View>
      </View>
    </TouchableCard>
  );
};

const CARD_SURFACE = '#D4D4D4';
const TEXT_PRIMARY = '#262626';
const BUTTON_PRIMARY = '#006DB4';
const BUTTON_SECONDARY_BG = 'rgba(238, 249, 255, 0.7)';
const BUTTON_SECONDARY_BG_DARK = 'rgba(0, 109, 180, 0.2)';

const createStyles = ({
  colors,
  dark,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    touchable: {
      flex: 1,
    },
    card: {
      flex: 1,
      gap: spacing[5],
      justifyContent: 'flex-end',
      marginVertical: 0,
      padding: spacing[2],
      borderRadius: shapes.lg,
      backgroundColor: dark ? colors.surfaceDark : CARD_SURFACE,
      elevation: 0,
    },
    textContainer: {
      gap: spacing[0.5],
      width: '100%',
    },
    label: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 18,
      color: dark ? colors.prose : TEXT_PRIMARY,
    },
    title: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 17.5,
      color: dark ? colors.heading : TEXT_PRIMARY,
    },
    buttonRow: {
      width: '100%',
      alignItems: 'flex-end',
    },
    iconButton: {
      height: 24,
      minWidth: 24,
      paddingHorizontal: spacing[3],
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: BUTTON_PRIMARY,
      backgroundColor: dark ? BUTTON_SECONDARY_BG_DARK : BUTTON_SECONDARY_BG,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
