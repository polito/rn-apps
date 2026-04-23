import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, useTheme } from '@polito/lib/ui';

interface Props {
  sortLabel?: string;
  onSortPress: () => void;
  onMorePress: () => void;
  sortButtonRef?: any;
  moreButtonRef?: any;
}

export const CourseFilesMenu = ({
  sortLabel,
  onSortPress,
  onMorePress,
  sortButtonRef,
  moreButtonRef,
}: Props) => {
  const { palettes, fontSizes, spacing } = useTheme();
  const { t } = useTranslation();

  const iconColor = palettes.primary[400];
  const label =
    sortLabel ?? t('common.oldestFirst', { defaultValue: 'Oldest first' });

  return (
    <View style={styles.root}>
      <TouchableOpacity
        onPress={onSortPress}
        accessibilityRole="button"
        ref={sortButtonRef}
        style={[
          styles.sortButton,
          {
            borderRadius: spacing[1],
            height: 40,
          },
        ]}
      >
        <View
          style={[
            styles.selectorHeader,
            {
              padding: spacing[2.5],
              gap: spacing[2.5],
              borderRadius: spacing[2.5],
            },
          ]}
        >
          <Text
            style={[styles.sortLabel, { color: iconColor }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon
              icon={faChevronDown}
              size={fontSizes.md}
              color={iconColor}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onMorePress}
        accessibilityRole="button"
        ref={moreButtonRef}
        style={[
          styles.ellipsisButton,
          {
            borderRadius: spacing[2.5],
            height: 40,
          },
        ]}
      >
        <View
          style={[
            styles.selectorHeader,
            {
              padding: spacing[2.5],
              gap: spacing[2.5],
            },
          ]}
        >
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faEllipsis} size={20} color={iconColor} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  sortButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  ellipsisButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconWrapper: {
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sortLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
});
