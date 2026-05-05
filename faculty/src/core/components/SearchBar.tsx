import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  faCircleXmark,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TextField, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  onClear,
  placeholder,
}: Props) => {
  const { palettes, colors, dark } = useTheme();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const fieldTextColor = dark ? colors.heading : palettes.gray[500];
  const fieldIconColor = dark ? colors.secondaryText : palettes.gray[500];
  const fieldBgColor = dark ? palettes.gray[700] : palettes.gray[200];
  const fieldBorderColor = dark ? palettes.gray[600] : palettes.gray[300];

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.field,
          { backgroundColor: fieldBgColor, borderColor: fieldBorderColor },
        ]}
      >
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={16}
            color={fieldIconColor}
          />
        </View>
        <TextField
          label={placeholder ?? t('common.search')}
          style={styles.textField}
          inputStyle={[styles.input, { color: fieldTextColor }]}
          value={value}
          onChangeText={onChangeText}
          selectionColor={palettes.secondary[600]}
          placeholderTextColor={
            dark ? colors.secondaryText : palettes.gray[500]
          }
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear ?? (() => onChangeText(''))}
            style={styles.iconWrapper}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
          >
            <FontAwesomeIcon
              icon={faCircleXmark}
              size={16}
              color={fieldIconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = ({
  spacing,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
      alignSelf: 'stretch',
      paddingTop: spacing[1],
    },
    field: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: spacing[1.5],
      borderWidth: 1,
      paddingHorizontal: spacing[1.5],
      paddingVertical: spacing[1],
      gap: spacing[1.5],
    },
    iconWrapper: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    input: {
      flex: 1,
      padding: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderBottomWidth: 0,
      textAlignVertical: 'center',
      includeFontPadding: false,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
    },
    textField: {
      flex: 1,
      paddingVertical: 0,
    },
  });
