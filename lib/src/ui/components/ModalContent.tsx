import { PropsWithChildren, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HeaderAccessory } from '../../ui/components/HeaderAccessory';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';

type Props = {
  title?: string;
  close: () => void;
  scrollViewRef?: any;
  setScrollOffset?: (value: number) => void;
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
  rightItemTitle,
  rightItemOnPress,
  footer,
}: PropsWithChildren<Props>) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  const handleOnScroll = useCallback(
    (event: any) => {
      if (setScrollOffset) {
        setScrollOffset(event.nativeEvent.contentOffset.y);
      }
    },
    [setScrollOffset],
  );

  return (
    <View style={styles.container}>
      <HeaderAccessory
        justify="space-between"
        align="center"
        style={styles.header}
      >
        <View style={styles.headerSide}>
          <Text
            style={styles.headerLeft}
            onPress={close}
            accessibilityRole="button"
          >
            {t('common.close')}
          </Text>
        </View>
        {title ? (
          <Text
            style={styles.modalTitle}
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
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
      maxHeight: '100%',
    },
    header: {
      paddingVertical: 11,
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
    },
    headerSide: {
      flex: 1,
    },
    headerSideRight: {
      alignItems: 'flex-end',
    },
    headerLeft: {
      padding: spacing[4],
      paddingVertical: 0,
      fontFamily: fontFamilies.body,
    },
    modalTitle: {
      flexShrink: 1,
      textAlign: 'center',
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.prose,
    },
    headerRight: {
      padding: spacing[4],
      paddingVertical: 0,
      color: palettes.lightBlue[500],
      fontFamily: fontFamilies.body,
    },
  });
