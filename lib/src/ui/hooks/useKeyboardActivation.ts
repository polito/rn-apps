import { useCallback, useMemo } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityActionInfo,
} from 'react-native';

export interface KeyboardActivationParams {
  onActivate?: (() => void) | null;
  disabled?: boolean | null;
  accessibilityActions?: ReadonlyArray<AccessibilityActionInfo>;
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
}

export const useKeyboardActivation = ({
  onActivate,
  disabled,
  accessibilityActions,
  onAccessibilityAction,
}: KeyboardActivationParams) => {
  const hasOwnActivate = !!accessibilityActions?.some(
    action => action.name === 'activate',
  );

  const actions = useMemo(
    () =>
      hasOwnActivate
        ? (accessibilityActions ?? [])
        : [...(accessibilityActions ?? []), { name: 'activate' }],
    [accessibilityActions, hasOwnActivate],
  );

  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (!hasOwnActivate && event.nativeEvent.actionName === 'activate') {
        onActivate?.();
      }
      onAccessibilityAction?.(event);
    },
    [hasOwnActivate, onActivate, onAccessibilityAction],
  );

  return {
    focusable: !disabled,
    accessibilityActions: actions,
    onAccessibilityAction: handleAccessibilityAction,
  };
};
