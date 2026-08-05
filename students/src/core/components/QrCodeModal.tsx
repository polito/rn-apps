import { PropsWithChildren, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  findNodeHandle,
} from 'react-native';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IS_ANDROID } from '@polito/lib/core';
import {
  Card,
  IconButton,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.5)';

type Props = PropsWithChildren<{
  visible?: boolean;
  onClose: () => void;
  maxWidth?: number;
  showCloseButton?: boolean;
}>;

export const QrCodeModal = ({
  visible = true,
  onClose,
  maxWidth,
  showCloseButton = true,
  children,
}: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const firstInteractiveRef = useRef<View>(null);

  useLayoutEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      const node = findNodeHandle(firstInteractiveRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }, 100);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop} accessibilityViewIsModal={IS_ANDROID}>
        <Pressable
          ref={firstInteractiveRef}
          style={styles.backdropTouchable}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
        />
        <View style={[styles.cardWrapper, maxWidth != null && { maxWidth }]}>
          <Card rounded gapped style={styles.card}>
            {showCloseButton && (
              <IconButton
                accessibilityLabel={t('common.close')}
                accessibilityRole="button"
                icon={faTimes}
                size={fontSizes.lg}
                color={colors.title}
                onPress={onClose}
                adjustSpacing="right"
                style={styles.closeButton}
              />
            )}
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              overScrollMode="always"
            >
              {children}
            </ScrollView>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: BACKDROP_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[5],
    },
    backdropTouchable: {
      ...StyleSheet.absoluteFillObject,
    },
    scroll: {
      flexGrow: 0,
    },
    scrollContent: {
      gap: spacing[4],
      paddingTop: spacing[2],
    },
    cardWrapper: {
      width: '100%',
      maxWidth: 480,
      maxHeight: '100%',
    },
    card: {
      flexShrink: 1,
      marginVertical: 0,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[5],
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    closeButton: {
      position: 'absolute',
      right: spacing[5],
      top: spacing[5] + spacing[2] - spacing[3],
      zIndex: 1,
    },
  });
