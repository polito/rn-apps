import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

type Props = {
  label: string;
  date: Date | null;
  onPress: () => void;
};

export const formatNoticeDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export const NoticeDateCard = ({ label, date, onPress }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  const value = date ? formatNoticeDate(date) : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value ?? t('courseNoticesTab.dateNotSet')}`}
      accessibilityHint={t('courseNoticesTab.dateHint')}
    >
      <Row align="center" gap={3}>
        <Icon
          icon={faCalendarDay}
          size={fontSizes['2xl']}
          color={value ? colors.heading : colors.secondaryText}
        />
        <Col style={styles.texts}>
          <Text
            style={[styles.title, value ? styles.titleSelected : undefined]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <Text
            style={[styles.value, value ? styles.valueSelected : undefined]}
            numberOfLines={1}
          >
            {value ?? t('courseNoticesTab.datePlaceholder')}
          </Text>
        </Col>
      </Row>
    </Pressable>
  );
};

const createStyles = ({
  colors,
  fontFamilies,
  fontSizes,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: shapes.lg,
      backgroundColor: colors.surface,
    },
    pressed: {
      opacity: 0.8,
    },
    texts: {
      flexShrink: 1,
    },
    title: {
      fontFamily: fontFamilies.heading,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
      color: colors.secondaryText,
    },
    titleSelected: {
      color: colors.heading,
    },
    value: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
      color: colors.secondaryText,
    },
    valueSelected: {
      color: colors.prose,
    },
  });
