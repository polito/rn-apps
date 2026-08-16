import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  ListItem,
  StatefulMenuView,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { bookingsColors } from '../utils/bookingsTheme';

export const NO_PREFERENCE = '__none__';

export type MenuOption = { id: string; title: string };

interface Props {
  icon: IconDefinition;
  title: string;
  value: string;
  placeholder?: string;
  options: MenuOption[];
  onSelect: (id: string) => void;
  allowNoPreference?: boolean;
  noPreferenceLabel?: string;
  iconSize?: number;
  inverted?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SelectMenuField = ({
  icon,
  title,
  value,
  placeholder = '',
  options,
  onSelect,
  allowNoPreference = false,
  noPreferenceLabel,
  iconSize,
  inverted = false,
  containerStyle,
}: Props) => {
  const { dark, colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const iconColor = dark ? colors.secondaryText : bookingsColors.textHeading;
  const resolvedIconSize = iconSize ?? fontSizes['2xl'];
  const displayValue =
    options.find(option => option.id === value)?.title ?? value;

  const actions = [
    ...(allowNoPreference && noPreferenceLabel
      ? [{ id: NO_PREFERENCE, title: noPreferenceLabel }]
      : []),
    ...options.map(option => ({
      id: option.id,
      title: option.title,
      state: (value === option.id ? 'on' : 'off') as 'on' | 'off',
    })),
  ];

  const primaryText = inverted ? displayValue || placeholder : title;
  const secondaryText = inverted ? title : displayValue || placeholder;

  return (
    <StatefulMenuView
      style={styles.menuFill}
      title={title}
      actions={actions}
      onPressAction={({ nativeEvent: { event } }) =>
        onSelect(allowNoPreference && event === NO_PREFERENCE ? '' : event)
      }
    >
      <ListItem
        isAction
        inverted={inverted}
        leadingItem={
          <Icon icon={icon} size={resolvedIconSize} color={iconColor} />
        }
        title={primaryText}
        titleStyle={inverted ? styles.filterValue : styles.listTitle}
        subtitle={secondaryText}
        subtitleStyle={inverted ? styles.filterLabel : styles.listSubtitle}
        subtitleProps={inverted ? { numberOfLines: 1 } : undefined}
        containerStyle={[styles.listItem, containerStyle]}
        trailingItem={
          <Icon icon={faChevronDown} color={colors.secondaryText} />
        }
      />
    </StatefulMenuView>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
}: Theme) =>
  StyleSheet.create({
    menuFill: {
      flex: 1,
      width: '100%',
    },
    listItem: {
      minHeight: 52,
      paddingVertical: spacing[1],
    },
    listTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : bookingsColors.textPrimary,
    },
    listSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.prose : bookingsColors.textSubtitle,
    },
    filterLabel: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
      color: dark ? colors.prose : bookingsColors.textSubtitle,
    },
    filterValue: {
      flex: 0,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : bookingsColors.textPrimary,
    },
  });
