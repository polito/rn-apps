import type { StyleProp, ViewStyle } from 'react-native';

import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { HeaderAccessory } from './HeaderAccessory';
import { Tab } from './Tab';
import { Tabs } from './Tabs';

type Props = MaterialTopTabBarProps & {
  containerStyle?: StyleProp<ViewStyle>;
};

export const TopTabBar = ({
  state,
  descriptors,
  navigation,
  containerStyle,
}: Props) => {
  const { accessibility } = usePreferencesContext();
  return (
    <HeaderAccessory style={containerStyle}>
      <Tabs>
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
