import { PropsWithChildren, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
import { HeaderAccessory } from './HeaderAccessory';
import { IconButton } from './IconButton';
import { Text } from './Text';

type Props = {
  title?: string;
  close: () => void;
  scrollViewRef?: any;
  setScrollOffset?: (value: number) => void;
  closeVariant?: 'icon' | 'text';
  closeIconColor?: string;
  closeButtonStyle?: StyleProp<ViewStyle>;
  rightItemTitle?: string;
  rightItemOnPress?: () => void;
  footer?: ReactNode;
};

export const ModalContent = ({
  children,
  close,
  title,
  scrollViewRef,
  setScrollOffset,
  closeVariant = 'icon',
  closeIconColor,
  closeButtonStyle,
  rightItemTitle,
  rightItemOnPress,
  footer,
}: PropsWithChildren<Props>) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const isTextVariant = closeVariant === 'text';

  const handleOnScroll = useCallback(
    (event: any) => {
      if (setScrollOffset) {
        setScrollOffset(event.nativeEvent.contentOffset.y);
      }
    },
    [setScrollOffset],
  );

  return (
    <View style={[styles.container, isTextVariant && styles.textContainer]}>
      <HeaderAccessory
        justify="space-between"
        align="center"
        style={[styles.header, isTextVariant && styles.textHeader]}
      >
        {isTextVariant ? (
          <>
            <View style={styles.headerSide}>
              <Text
                style={styles.headerLeftText}
                onPress={close}
                accessibilityRole="button"
              >
                {t('common.close')}
              </Text>
            </View>
            {title ? (
              <Text
                style={[styles.modalTitle, styles.textModalTitle]}
                numberOfLines={1}
                accessibilityRole="header"
              >
                {title}
              </Text>
            ) : null}
            <View style={[styles.headerSide, styles.headerSideRight]}>
              {rightItemTitle && (
                <Text
                  style={styles.headerRight}
                  onPress={rightItemOnPress}
                  accessibilityRole="button"
                >
                  {rightItemTitle}
                </Text>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.headerLeft} />
            <Text style={styles.modalTitle} accessibilityRole="header">
              {title}
            </Text>
            <IconButton
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
              icon={faTimes}
              color={closeIconColor}
              onPress={close}
              adjustSpacing="left"
              style={closeButtonStyle}
            />
          </>
        )}
      </HeaderAccessory>
      <ScrollView
        onScroll={handleOnScroll}
        scrollEventThrottle={120}
        ref={scrollViewRef}
      >
        {children}
      </ScrollView>
      {footer}
    </View>
  );
};

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontSizes,
  fontFamilies,
  fontWeights,
  palettes,
  dark,
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
      maxHeight: '100%',
    },
    textContainer: {
      backgroundColor: colors.background,
    },
    header: {
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
      paddingVertical: spacing[1],
      backgroundColor: dark ? colors.background : colors.surface,
    },
    textHeader: {
      paddingVertical: 11,
      backgroundColor: undefined,
    },
    headerLeft: { padding: spacing[3] },
    headerSide: {
      flex: 1,
    },
    headerSideRight: {
      alignItems: 'flex-end',
    },
    headerLeftText: {
      padding: spacing[4],
      paddingVertical: 0,
      fontFamily: fontFamilies.body,
    },
    modalTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.prose,
    },
    textModalTitle: {
      flexShrink: 1,
      textAlign: 'center',
    },
    headerRight: {
      padding: spacing[4],
      paddingVertical: 0,
      color: palettes.lightBlue[500],
      fontFamily: fontFamilies.body,
    },
  });
