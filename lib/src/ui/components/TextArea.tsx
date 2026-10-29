import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Col } from './Col';
import { Row } from './Row';
import { Text } from './Text';

type TextAreaProps = Omit<TextInputProps, 'multiline' | 'textAlignVertical'> & {
  label: string;
  cardStyle?: StyleProp<ViewStyle>;
  description?: string;
  errorDescription?: string;
  unlimited?: boolean;
};

export const TextArea = ({
  label,
  cardStyle,
  description,
  errorDescription,
  unlimited = false,
  ...inputProps
}: TextAreaProps) => {
  const { palettes, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const [isFocused, setIsFocused] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const { onFocus, onBlur, style, ...restInputProps } = inputProps;
  const maxCharacters = unlimited ? undefined : (inputProps.maxLength ?? 128);
  const textValue = inputProps.value ?? inputProps.defaultValue ?? '';
  const charCount =
    maxCharacters != null
      ? Math.max(maxCharacters - textValue.length, 0)
      : null;
  const hasError = !!errorDescription;
  const { placeholder } = inputProps;
  const { t } = useTranslation();
  return (
    <View>
      <Pressable
        style={[
          styles.card,
          {
            height: unlimited ? undefined : 175,
            minHeight: 175,
            width: '100%',
            borderColor: hasError
              ? palettes.danger[500]
              : isFocused
                ? palettes.primary[500]
                : colors.surface,
          },
          cardStyle,
        ]}
      >
        <Col style={unlimited && { alignItems: 'stretch' }}>
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text
              style={[
                styles.cardTitle,
                (isFocused || textValue.length > 0) && styles.cardTitleActive,
              ]}
              importantForAccessibility="no"
              accessibilityElementsHidden
            >
              {label}
            </Text>
            {charCount != null && (
              <Text style={styles.charCount}>{charCount}</Text>
            )}
          </Row>
          <TextInput
            placeholder={placeholder ?? t('common.textAreaPlaceholder')}
            accessibilityLabel={label}
            {...restInputProps}
            maxLength={maxCharacters}
            placeholderTextColor={colors.secondaryText}
            multiline
            textAlignVertical="top"
            onContentSizeChange={event => {
              if (unlimited) {
                setContentHeight(event.nativeEvent.contentSize.height);
              }
            }}
            onFocus={event => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={event => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            style={[
              styles.textAreaInput,
              unlimited && {
                height: Math.max(
                  styles.textAreaInput.minHeight ?? 0,
                  contentHeight,
                ),
              },
              style,
            ]}
          />
        </Col>
      </Pressable>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : errorDescription ? (
        <Text style={[styles.description, { color: palettes.danger[700] }]}>
          {errorDescription}
        </Text>
      ) : null}
    </View>
  );
};

const createStyles = ({
  spacing,
  shapes,
  fontSizes,
  fontFamilies,
  colors,
}: Theme) =>
  StyleSheet.create({
    card: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      marginVertical: 0,
      elevation: 0,
      borderWidth: 1,
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
    },
    cardTitle: {
      color: colors.secondaryText,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
      fontFamily: fontFamilies.heading,
    },
    cardTitleActive: {
      color: colors.heading,
    },
    textAreaInput: {
      color: colors.prose,
      fontSize: fontSizes.md,
      fontFamily: fontFamilies.body,
      paddingHorizontal: 0,
      paddingVertical: 0,
      minHeight: spacing[24],
      flexGrow: 1,
    },
    charCount: {
      color: colors.secondaryText,
      fontSize: fontSizes.md,
      fontFamily: fontFamilies.title,
    },
    description: {
      color: colors.secondaryText,
      fontSize: fontSizes.sm,
      fontFamily: fontFamilies.body,
      paddingHorizontal: spacing[3],
      marginTop: spacing[1],
    },
  });
