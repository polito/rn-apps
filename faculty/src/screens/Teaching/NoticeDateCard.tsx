import { useTranslation } from 'react-i18next';
import { AccessibilityActionEvent, Pressable, StyleSheet } from 'react-native';

import { faCalendarDay, faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Icon,
  IconButton,
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
  emptyLabel?: string;
  onClear?: () => void;
};

export const formatNoticeDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const NoticeDateCard = ({
  label,
  date,
  onPress,
  emptyLabel,
  onClear,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();
  const value = date
    ? isToday(date)
      ? t('common.today')
      : formatNoticeDate(date)
    : (emptyLabel ?? null);
  const canClear = !!date && !!onClear;

  const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === 'activate') onPress();
    if (event.nativeEvent.actionName === 'clear') onClear?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value ?? t('courseNoticesTab.dateNotSet')}`}
      accessibilityHint={t('courseNoticesTab.dateHint')}
      accessibilityActions={
        canClear
          ? [
              { name: 'activate' },
              { name: 'clear', label: t('courseNoticesTab.clearDate') },
            ]
          : undefined
      }
      onAccessibilityAction={handleAccessibilityAction}
    >
      <Row align="center" gap={3}>
        <Icon
          icon={faCalendarDay}
          size={fontSizes.xl}
          color={colors.secondaryText}
        />
        <Col style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {label}
          </Text>
          <Row align="center" gap={1.5}>
            <Text
              style={[styles.value, value ? styles.valueSelected : undefined]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {value ?? t('courseNoticesTab.datePlaceholder')}
            </Text>
            {canClear ? (
              <IconButton
                icon={faXmark}
                size={fontSizes.sm}
                color={colors.secondaryText}
                onPress={onClear}
                noPadding
                hitSlop={17}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
            ) : null}
          </Row>
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
      paddingVertical: spacing[3],
      borderRadius: shapes.lg,
      backgroundColor: colors.surface,
    },
    pressed: {
      opacity: 0.8,
    },
    texts: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.4,
      color: colors.prose,
    },
    value: {
      flexShrink: 1,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.4,
      color: colors.secondaryText,
    },
    valueSelected: {
      color: colors.heading,
    },
  });
