import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
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
  findNodeHandle,
} from 'react-native';

import { IS_ANDROID } from '../../core/constants';
import { useTheme } from '../hooks/useTheme';

const ANIMATION_DURATION = 300;
const BACKDROP_OPACITY = 0.4;
const SWIPE_CLOSE_DISTANCE_RATIO = 0.3;
const SWIPE_CLOSE_VELOCITY = 0.5;

type RegisterFocusTarget = (node: View | null) => void;

export const BottomModalFocusContext =
  createContext<RegisterFocusTarget | null>(null);

export const useBottomModalFocus = () => useContext(BottomModalFocusContext);

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
  const sheetRef = useRef<View>(null);
  const focusTargetRef = useRef<View | null>(null);

  const registerFocusTarget = useCallback<RegisterFocusTarget>(node => {
    focusTargetRef.current = node;
  }, []);

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

  useLayoutEffect(() => {
    if (!mounted || !visible) return;

    const timer = setTimeout(() => {
      const target = focusTargetRef.current ?? sheetRef.current;
      const node = findNodeHandle(target);
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node);
      }
    }, ANIMATION_DURATION + 50);

    return () => clearTimeout(timer);
  }, [mounted, visible]);

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
            ref={sheetRef}
            onLayout={onSheetLayout}
            accessibilityViewIsModal={IS_ANDROID}
            style={[styles.sheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <BottomModalFocusContext.Provider value={registerFocusTarget}>
              {children}
            </BottomModalFocusContext.Provider>
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
