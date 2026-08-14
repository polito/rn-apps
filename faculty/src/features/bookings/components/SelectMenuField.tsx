import { StyleSheet } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  Icon,
  ListItem,
  StatefulMenuView,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

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
}

const TEXT_HEADING = '#45556C';
const TEXT_PRIMARY = '#262626';
const TEXT_SUBTITLE = '#314158';

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
}: Props) => {
  const { dark, colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const iconColor = dark ? colors.secondaryText : TEXT_HEADING;
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

  return (
    <StatefulMenuView
      style={styles.menuFill}
      title={title}
      actions={actions}
      onPressAction={({ nativeEvent: { event } }) =>
        onSelect(
          allowNoPreference && event === NO_PREFERENCE ? '' : event,
        )
      }
    >
      <ListItem
        isAction
        leadingItem={
          <Icon icon={icon} size={resolvedIconSize} color={iconColor} />
        }
        title={title}
        titleStyle={styles.listTitle}
        subtitle={displayValue || placeholder}
        subtitleStyle={styles.listSubtitle}
        containerStyle={styles.listItem}
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
      color: dark ? colors.title : TEXT_PRIMARY,
    },
    listSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 16,
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
  });
