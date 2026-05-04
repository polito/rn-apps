import { PropsWithChildren, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
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
  fill?: boolean;
  headerMode?: 'default' | 'closeOnly';
  closeLabel?: string;
  closeIconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
};

export const ModalContent = ({
  children,
  close,
  title,
  scrollViewRef,
  setScrollOffset,
  fill = false,
  headerMode = 'default',
  closeLabel,
  closeIconColor,
  containerStyle,
  headerStyle,
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
    <View
      style={[styles.container, fill && styles.containerFill, containerStyle]}
    >
      {headerMode === 'closeOnly' ? (
        <HeaderAccessory
          justify="flex-start"
          align="center"
          style={[styles.header, styles.headerCloseOnly, headerStyle]}
        >
          <TouchableOpacity
            accessibilityLabel={closeLabel ?? t('common.close')}
            accessibilityRole="button"
            onPress={close}
            style={styles.closeOnlyButton}
          >
            <Text style={styles.closeOnlyText}>
              {closeLabel ?? t('common.close')}
            </Text>
          </TouchableOpacity>
        </HeaderAccessory>
      ) : (
        <HeaderAccessory
          justify="space-between"
          align="center"
          style={[styles.header, headerStyle]}
        >
          <View style={styles.headerLeft} />
          <Text style={styles.modalTitle}>{title}</Text>
          <IconButton
            accessibilityLabel={t('common.close')}
            accessibilityRole="button"
            icon={faTimes}
            color={closeIconColor}
            onPress={close}
            adjustSpacing="left"
          />
        </HeaderAccessory>
      )}
      <ScrollView
        style={fill ? styles.scrollFill : undefined}
        onScroll={handleOnScroll}
        scrollEventThrottle={120}
        ref={scrollViewRef}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontSizes,
  fontWeights,
  dark,
}: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
      maxHeight: '100%',
    },
    containerFill: {
      flex: 1,
    },
    scrollFill: {
      flex: 1,
    },
    header: {
      borderTopRightRadius: shapes.md,
      borderTopLeftRadius: shapes.md,
      paddingVertical: spacing[1],
      backgroundColor: dark ? colors.background : colors.surface,
    },
    headerLeft: { padding: spacing[3] },
    headerCloseOnly: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
    },
    closeOnlyButton: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[1],
    },
    closeOnlyText: {
      fontSize: fontSizes.lg,
      color: colors.secondaryText,
      fontWeight: fontWeights.medium,
    },
    modalTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.prose,
    },
  });
