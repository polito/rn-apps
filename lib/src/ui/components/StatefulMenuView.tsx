import { useCallback, useMemo } from 'react';

import { MenuAction, MenuView } from '@react-native-menu/menu';
import { MenuComponentProps } from '@react-native-menu/menu/src/types';

import { IS_ANDROID } from '../../core/constants';

export const StatefulMenuView = ({
  actions,
  children,
  ...props
}: MenuComponentProps) => {
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
    <MenuView actions={effectiveActions} {...props}>
      {children}
    </MenuView>
  );
};
