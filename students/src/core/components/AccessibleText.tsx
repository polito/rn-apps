import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ViewProps } from 'react-native';

import { TextProps as LibTextProps, Text } from '@polito/lib/ui';

type SupportedLanguage = 'en' | 'it';

interface AccessibleTextProps extends Omit<LibTextProps, 'children'> {
  language?: SupportedLanguage;
  children: React.ReactNode;
}

export const AccessibleText = ({
  language,
  children,
  ...rest
}: AccessibleTextProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage;

  const accessibilityLanguage =
    language && language !== currentLanguage ? language : undefined;

  return (
    <Text {...rest} accessibilityLanguage={accessibilityLanguage}>
      {children}
    </Text>
  );
};

interface MultiLingualTextSegment {
  text: string;
  language?: SupportedLanguage;
}

interface MultiLingualTextProps extends ViewProps {
  segments: MultiLingualTextSegment[];
  variant?: LibTextProps['variant'];
}

export const MultiLingualText = ({
  segments,
  variant,
  ...rest
}: MultiLingualTextProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage;

  return (
    <View accessible={true} {...rest}>
      {segments.map((segment, idx) => {
        const accessibilityLanguage =
          segment.language && segment.language !== currentLanguage
            ? segment.language
            : undefined;

        return (
          <Text
            key={`segment-${segment.language}-${idx}`}
            variant={variant}
            accessibilityLanguage={accessibilityLanguage}
          >
            {segment.text}
          </Text>
        );
      })}
    </View>
  );
};

export function useAccessibleLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as SupportedLanguage;

  const getAccessibilityLanguage = (
    contentLanguage?: SupportedLanguage,
  ): string | undefined => {
    if (contentLanguage && contentLanguage !== currentLanguage) {
      return contentLanguage;
    }
    return undefined;
  };

  const getLanguageAccessibilityProps = (
    contentLanguage?: SupportedLanguage,
  ) => {
    const accessibilityLanguage = getAccessibilityLanguage(contentLanguage);
    return accessibilityLanguage ? { accessibilityLanguage } : {};
  };

  return {
    currentLanguage,
    getAccessibilityLanguage,
    getLanguageAccessibilityProps,
  };
}
