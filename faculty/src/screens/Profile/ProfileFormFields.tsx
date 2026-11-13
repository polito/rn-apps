import { PropsWithChildren, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronDown,
  faCircleCheck,
  faCircleXmark,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { RTFTrans } from '@polito/lib/features/auth';
import {
  Icon,
  IconButton,
  Row,
  StatefulMenuView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  errorCodes,
  isErrorWithCode,
  pick,
} from '@react-native-documents/picker';

import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

export const countries = [
  { id: 'IT', it: 'Italia', en: 'Italy' },
  { id: 'FR', it: 'Francia', en: 'France' },
  { id: 'DE', it: 'Germania', en: 'Germany' },
  { id: 'ES', it: 'Spagna', en: 'Spain' },
  { id: 'BD', it: 'Bangladesh', en: 'Bangladesh' },
  { id: 'EG', it: 'Egitto', en: 'Egypt' },
  { id: 'US', it: 'Stati Uniti', en: 'United States' },
];

export const confirmAlert = (
  t: TFunction,
  message: string,
  onConfirm: () => void,
) =>
  Alert.alert(t('common.areYouSure?'), message, [
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('common.confirm'), onPress: onConfirm },
  ]);

export const pickFileName = async (type: string[]) => {
  try {
    const [file] = await pick({ type });
    return file?.name ?? undefined;
  } catch (error) {
    if (!isErrorWithCode(error) || error.code !== errorCodes.OPERATION_CANCELED)
      console.error('Cannot pick file', error);
  }
};

const fieldLabel = (label: string, required?: boolean) =>
  required ? `${label}*` : label;

const useFieldA11yLabel = (label: string, required?: boolean) => {
  const { t } = useTranslation();
  return required ? t('personalInfoForm.required', { field: label }) : label;
};

type FieldInputProps = Omit<TextInputProps, 'style'> & {
  label: string;
  required?: boolean;
  hint?: string;
  onClear?: () => void;
};

export const ProfileFieldInput = ({
  label,
  required,
  hint,
  onClear,
  ...inputProps
}: FieldInputProps) => {
  const { t } = useTranslation();
  const { palettes, colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const [focused, setFocused] = useState(false);
  const a11yLabel = useFieldA11yLabel(label, required);

  return (
    <View style={styles.flex}>
      <Row align="center" style={[styles.card, focused && styles.cardFocused]}>
        <View style={styles.flex}>
          <Text style={styles.inputLabel} accessible={false}>
            {fieldLabel(label, required)}
          </Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={colors.secondaryText}
            selectionColor={palettes.orange[600]}
            cursorColor={palettes.orange[600]}
            accessibilityLabel={a11yLabel}
            accessibilityHint={hint}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...inputProps}
          />
        </View>
        {onClear && !!inputProps.value && (
          <IconButton
            icon={faCircleXmark}
            size={fontSizes.md}
            color={colors.secondaryText}
            accessibilityLabel={t('personalInfoForm.clearField', {
              field: label,
            })}
            onPress={onClear}
            adjustSpacing="right"
          />
        )}
      </Row>
      {hint && (
        <Text
          variant="secondaryText"
          style={styles.hint}
          importantForAccessibility="no"
          accessibilityElementsHidden
        >
          {hint}
        </Text>
      )}
    </View>
  );
};

type FieldSelectProps = {
  label: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  icon?: IconDefinition;
  options?: { id: string; title: string }[];
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export const ProfileFieldSelect = ({
  label,
  required,
  value,
  placeholder,
  icon,
  options = [],
  selectedId,
  onSelect,
}: FieldSelectProps) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const a11yLabel = useFieldA11yLabel(label, required);
  const selectable = options.length > 0;
  const displayValue = value || placeholder || t('common.noValue');

  const content = (
    <Row
      align="center"
      gap={3}
      style={styles.card}
      accessible
      accessibilityRole={selectable ? 'button' : 'text'}
      accessibilityLabel={`${a11yLabel}: ${displayValue}`}
    >
      {icon && (
        <Icon icon={icon} size={fontSizes.lg} color={colors.secondaryText} />
      )}
      <View style={styles.flex}>
        <Text style={styles.selectLabel}>{fieldLabel(label, required)}</Text>
        <Row align="center" gap={2}>
          <Text style={styles.selectValue} numberOfLines={1}>
            {value || placeholder || '-'}
          </Text>
          {selectable && (
            <Icon
              icon={faChevronDown}
              size={fontSizes.sm}
              color={colors.title}
            />
          )}
        </Row>
      </View>
    </Row>
  );

  if (!selectable) return <View style={styles.flex}>{content}</View>;

  return (
    <View style={styles.flex}>
      <StatefulMenuView
        actions={options.map(option => ({
          id: option.id,
          title: option.title,
          state: option.id === selectedId ? ('on' as const) : undefined,
        }))}
        onPressAction={({ nativeEvent: { event } }) => onSelect?.(event)}
      >
        {content}
      </StatefulMenuView>
    </View>
  );
};

type FieldDateProps = {
  label: string;
  required?: boolean;
  icon?: IconDefinition;
  value?: Date;
  onChange: (date: Date) => void;
};

export const ProfileFieldDate = ({
  label,
  required,
  icon,
  value,
  onChange,
}: FieldDateProps) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const a11yLabel = useFieldA11yLabel(label, required);
  const [open, setOpen] = useState(false);
  const display = value
    ? DateTime.fromJSDate(value).toFormat('dd/MM/yy')
    : t('personalInfoForm.datePlaceholder');

  return (
    <View style={styles.flex}>
      <Pressable
        onPress={() => setOpen(prev => !prev)}
        accessibilityRole="button"
        accessibilityLabel={`${a11yLabel}: ${display}`}
        accessibilityState={{ expanded: open }}
      >
        <Row align="center" gap={3} style={styles.card}>
          {icon && (
            <Icon
              icon={icon}
              size={fontSizes.lg}
              color={colors.secondaryText}
            />
          )}
          <View style={styles.flex}>
            <Text style={styles.selectLabel}>
              {fieldLabel(label, required)}
            </Text>
            <Row align="center" gap={2}>
              <Text style={styles.selectValue} numberOfLines={1}>
                {display}
              </Text>
              <Icon
                icon={faChevronDown}
                size={fontSizes.sm}
                color={colors.title}
              />
            </Row>
          </View>
        </Row>
      </Pressable>
      {open && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            if (Platform.OS !== 'ios' || event.type !== 'set') setOpen(false);
            if (event.type === 'set' && date) {
              onChange(date);
              setOpen(false);
            }
          }}
        />
      )}
    </View>
  );
};

export const ProfileFieldRow = ({ children }: PropsWithChildren) => {
  const styles = useStylesheet(createStyles);
  return <Row style={styles.fieldRow}>{children}</Row>;
};

type CheckboxRowProps = {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  i18nKey?: string;
  style?: object;
};

export const CheckboxRow = ({
  checked,
  onToggle,
  label,
  i18nKey,
  style,
}: CheckboxRowProps) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label ?? t(i18nKey!).replace(/<\/?b>/g, '')}
      style={[styles.checkboxRow, style]}
    >
      <Icon
        icon={checked ? faSquareCheck : faSquare}
        size={fontSizes.lg}
        color={checked ? colors.link : colors.secondaryText}
      />
      {i18nKey ? (
        <RTFTrans i18nKey={i18nKey} style={styles.checkboxText} />
      ) : (
        <Text weight="semibold" style={styles.checkboxLabel}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

type UploadRowProps = {
  title: string;
  subtitle: string;
  icon: IconDefinition;
  uploaded?: boolean;
  onPress: () => void;
};

export const UploadRow = ({
  title,
  subtitle,
  icon,
  uploaded,
  onPress,
}: UploadRowProps) => {
  const { colors, palettes, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
    >
      <Row align="center" gap={4} style={styles.card}>
        <Icon icon={icon} size={fontSizes['2xl']} color={colors.title} />
        <View style={styles.flex}>
          <Text weight="semibold" style={styles.uploadTitle}>
            {title}
          </Text>
          <Text style={styles.uploadSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <Icon
          icon={uploaded ? faCircleCheck : faUpload}
          size={fontSizes.md}
          color={uploaded ? palettes.success[600] : colors.secondaryText}
        />
      </Row>
    </Pressable>
  );
};

export const FormNote = ({ children }: { children: ReactNode }) => {
  const styles = useStylesheet(createStyles);
  return <Text style={styles.note}>{children}</Text>;
};

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontSizes,
  fontFamilies,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    fieldRow: {
      gap: spacing[2.5],
    },
    card: {
      minHeight: 60,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: colors.surface,
      backgroundColor: colors.surface,
    },
    cardFocused: {
      borderColor: colors.link,
    },
    inputLabel: {
      color: colors.prose,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
    },
    input: {
      color: colors.prose,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      padding: 0,
      margin: 0,
    },
    hint: {
      fontSize: fontSizes.xs,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[1],
    },
    selectLabel: {
      color: colors.prose,
      fontSize: fontSizes.sm,
    },
    selectValue: {
      color: colors.title,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      flexShrink: 1,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      paddingVertical: spacing[2],
    },
    checkboxLabel: {
      fontSize: fontSizes.xs,
      flex: 1,
    },
    checkboxText: {
      color: colors.prose,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      flex: 1,
    },
    uploadTitle: {
      fontSize: fontSizes.sm,
    },
    uploadSubtitle: {
      fontSize: fontSizes.xs,
      color: colors.prose,
    },
    note: {
      color: colors.prose,
      fontSize: fontSizes.xs,
    },
  });
