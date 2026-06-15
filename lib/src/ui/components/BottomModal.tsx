import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useTheme } from '../hooks/useTheme';

const ANIMATION_DURATION = 300;
const BACKDROP_OPACITY = 0.4;
const SWIPE_CLOSE_DISTANCE_RATIO = 0.3;
const SWIPE_CLOSE_VELOCITY = 0.5;

export type BottomModalProps = PropsWithChildren<{
  visible: boolean;
  onClose?: () => void;
  dismissable?: boolean;
  scrollOffset?: number;
  scrollViewRef?: any;
  onModalHide?: () => void;
}>;

export const BottomModal = ({
  children,
  visible,
  onClose,
  dismissable,
  scrollOffset = 0,
  onModalHide,
}: BottomModalProps) => {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const [sheetHeight, setSheetHeight] = useState(
    Dimensions.get('window').height,
  );

  const progress = useRef(new Animated.Value(0)).current;

  const sheetHeightRef = useRef(sheetHeight);
  sheetHeightRef.current = sheetHeight;
  const scrollOffsetRef = useRef(scrollOffset);
  scrollOffsetRef.current = scrollOffset;
  const dismissableRef = useRef(dismissable);
  dismissableRef.current = dismissable;
  const onModalHideRef = useRef(onModalHide);
  onModalHideRef.current = onModalHide;

  const close = () => dismissableRef.current && onClose?.();

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else if (mounted) {
      Animated.timing(progress, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          onModalHideRef.current?.();
        }
      });
    }
  }, [visible, mounted, progress]);

  useEffect(() => {
    if (mounted && visible) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [mounted, visible, progress]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !!dismissableRef.current &&
        gesture.dy > 4 &&
        Math.abs(gesture.dy) > Math.abs(gesture.dx) &&
        scrollOffsetRef.current <= 0,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy <= 0) return;
        const next = 1 - gesture.dy / sheetHeightRef.current;
        progress.setValue(Math.max(0, Math.min(1, next)));
      },
      onPanResponderRelease: (_, gesture) => {
        const shouldClose =
          gesture.dy > sheetHeightRef.current * SWIPE_CLOSE_DISTANCE_RATIO ||
          gesture.vy > SWIPE_CLOSE_VELOCITY;
        if (shouldClose) {
          close();
        } else {
          Animated.timing(progress, {
            toValue: 1,
            duration: ANIMATION_DURATION / 2,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const onSheetLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0 && height !== sheetHeight) setSheetHeight(height);
  };

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetHeight, 0],
  });
  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BACKDROP_OPACITY],
  });

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
      supportedOrientations={['landscape', 'portrait']}
    >
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: colors.black, opacity: backdropOpacity },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </Animated.View>
        <KeyboardAvoidingView
          style={styles.keyboardAvoider}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          <Animated.View
            onLayout={onSheetLayout}
            style={[styles.sheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoider: {
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
  },
});
