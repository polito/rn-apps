import { StyleSheet, View } from 'react-native';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  Text,
  Theme,
  TouchableCard,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

interface Props {
  label: string;
  title: string;
  onPress: () => void;
}

export const BookingActionCard = ({ label, title, onPress }: Props) => {
  const { palettes } = useTheme();
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
          <Icon icon={faPaperPlane} size={12} color={palettes.navy[500]} />
        </View>
      </View>
    </TouchableCard>
  );
};

const createStyles = ({
  colors,
  dark,
  palettes,
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
      backgroundColor: dark ? colors.surface : palettes.gray[300],
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
      color: colors.prose,
    },
    title: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 17.5,
      color: colors.heading,
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
      borderColor: palettes.navy[500],
      backgroundColor: dark ? colors.surface : palettes.lightBlue[50],
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
