import { Ref, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { View, ViewProps } from 'react-native';

import {
  MenuAction,
  MenuComponentRef,
  MenuView,
} from '@react-native-menu/menu';
import { MenuComponentProps } from '@react-native-menu/menu/src/types';

import { IS_ANDROID } from '../../core/constants';
import { useAccessibilityFocus } from '../../core/hooks/useAccessibilityFocus';
import { useKeyboardActivation } from '../hooks/useKeyboardActivation';

export const StatefulMenuView = ({
  actions,
  children,
  onCloseMenu,
  ref,
  ...props
}: MenuComponentProps &
  Pick<
    ViewProps,
    | 'accessible'
    | 'accessibilityRole'
    | 'accessibilityLabel'
    | 'accessibilityHint'
    | 'accessibilityValue'
    | 'accessibilityState'
    | 'accessibilityActions'
    | 'onAccessibilityAction'
  > & { ref?: Ref<MenuComponentRef> }) => {
  const [menuRef, focusMenu] = useAccessibilityFocus<View>();
  const menuViewRef = useRef<MenuComponentRef>(null);
  useImperativeHandle(ref, () => ({
    show: () => menuViewRef.current?.show(),
  }));
  const keyboardActivationProps = useKeyboardActivation({
    onActivate: () => menuViewRef.current?.show(),
  });
  // Android maps `state` to checkable menu items (checkbox appearance). Strip
  // `state` from every action and mark selection in the title instead.
  const mapAction = useCallback((action: MenuAction) => {
    const { state, ...withoutState } = action;
    if (state === 'on') {
      return {
        ...withoutState,
        title: `✓ ${action.title}`,
      };
    }
    return withoutState;
  }, []);

  const effectiveActions = useMemo(() => {
    if (!IS_ANDROID) return actions;

    return actions.map(action => {
      if (action.subactions) {
        const parentWithoutState = { ...action };
        delete parentWithoutState.state;
        return {
          ...parentWithoutState,
          subactions: action.subactions.map(mapAction),
        };
      }
      return mapAction(action);
    });
  }, [actions, mapAction]);
  return (
    <MenuView
      {...props}
      ref={menuViewRef}
      actions={effectiveActions}
      onCloseMenu={() => {
        onCloseMenu?.();
        setTimeout(focusMenu, 300);
      }}
    >
      <View ref={menuRef} collapsable={false} {...keyboardActivationProps}>
        {children}
      </View>
    </MenuView>
  );
};
