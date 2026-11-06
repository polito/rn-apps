import { useCallback, useEffect, useRef } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';

import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { HeaderAccessory } from './HeaderAccessory';
import { Tab } from './Tab';
import { Tabs } from './Tabs';

type TabLayout = { x: number; width: number };

export const TopTabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
  const { accessibility } = usePreferencesContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const containerWidth = useRef(0);
  const tabLayouts = useRef<Record<number, TabLayout>>({});

  const scrollToTab = useCallback((index: number, animated = true) => {
    const layout = tabLayouts.current[index];
    if (!layout || !containerWidth.current) return;
    const x = layout.x - (containerWidth.current - layout.width) / 2;
    scrollViewRef.current?.scrollTo({ x: Math.max(0, x), animated });
  }, []);

  useEffect(() => {
    scrollToTab(state.index);
  }, [state.index, scrollToTab]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width;
    scrollToTab(state.index, false);
  };

  return (
    <HeaderAccessory>
      <Tabs ref={scrollViewRef} onLayout={onContainerLayout}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
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

          const onTabLayout = (e: LayoutChangeEvent) => {
            const { x, width } = e.nativeEvent.layout;
            tabLayouts.current[index] = { x, width };
            if (isFocused) scrollToTab(index, false);
          };

          const badgeElement = options.tabBarBadge?.();
          const badgeText =
            badgeElement && 'props' in badgeElement
              ? ((badgeElement as any).props.children as string | number)
              : undefined;

          return (
            <Tab
              key={route.key}
              selected={isFocused}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              onLayout={onTabLayout}
              badge={badgeText}
              style={
                accessibility?.fontSize && accessibility.fontSize > 125
                  ? { paddingVertical: 0 }
                  : undefined
              }
            >
              {label as string}
            </Tab>
          );
        })}
      </Tabs>
    </HeaderAccessory>
  );
};
