import { ReactNode, isValidElement, useCallback } from 'react';

import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { HeaderAccessory } from './HeaderAccessory';
import { Tab } from './Tab';
import { Tabs } from './Tabs';

const resolveTabLabel = (
  options: MaterialTopTabBarProps['descriptors'][string]['options'],
  routeName: string,
  focused: boolean,
): string => {
  if (typeof options.tabBarLabel === 'function') {
    const rendered = options.tabBarLabel({
      focused,
      color: '',
      children: typeof options.title === 'string' ? options.title : routeName,
    });
    if (typeof rendered === 'string') return rendered;
  } else if (typeof options.tabBarLabel === 'string') {
    return options.tabBarLabel;
  }

  if (typeof options.title === 'string') {
    return options.title;
  }

  return routeName;
};

const resolveBadgeCount = (badge: ReactNode): string | number | undefined => {
  if (!badge || !isValidElement(badge)) return undefined;

  const children = (badge.props as { children?: string | number })?.children;
  if (children == null || children === '') return undefined;

  if (typeof children === 'number') {
    return children > 0 ? children : undefined;
  }

  const trimmed = children.trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? trimmed : parsed > 0 ? parsed : undefined;
};

export const TopTabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
  const { accessibility } = usePreferencesContext();

  const getBadgeText = useCallback(
    (options: MaterialTopTabBarProps['descriptors'][string]['options']) =>
      resolveBadgeCount(options.tabBarBadge?.()),
    [],
  );

  return (
    <HeaderAccessory accessible={false}>
      <Tabs>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = resolveTabLabel(options, route.name, isFocused);
          const badgeText = getBadgeText(options);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: {},
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Tab
              key={route.key}
              selected={isFocused}
              accessibilityLabel={
                typeof options.tabBarAccessibilityLabel === 'string'
                  ? options.tabBarAccessibilityLabel
                  : undefined
              }
              testID={options.tabBarButtonTestID ?? route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              badge={badgeText}
              style={
                accessibility?.fontSize && accessibility.fontSize > 125
                  ? { paddingVertical: 0 }
                  : undefined
              }
            >
              {label}
            </Tab>
          );
        })}
      </Tabs>
    </HeaderAccessory>
  );
};
