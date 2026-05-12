import type { ReactNode } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faArrowLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

type AndroidTopBarProps = {
  onBack: () => void;
  /** Optional centered title. */
  title?: string;
  /**
   * Custom node rendered in the right slot. Defaults to a 44×44 spacer that
   * mirrors the back-button area to keep the title visually centered.
   */
  right?: ReactNode;
  /** Back button icon size. Defaults to 18. */
  iconSize?: number;
  /** Accessibility label for the back button. */
  backAccessibilityLabel?: string;
  /** Container style overrides (e.g. custom `backgroundColor` or `marginBottom`). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Title text style overrides (e.g. custom font or color). */
  titleStyle?: StyleProp<TextStyle>;
};

/**
 * Android (and other non-iOS) counterpart to `IosTopBar`. Renders a back
 * button, optional centered title, and a right slot, matching the layout that
 * was previously copy-pasted across student feature screens.
 */
export const AndroidTopBar = ({
  onBack,
  title,
  right,
  iconSize = 18,
  backAccessibilityLabel,
  containerStyle,
  titleStyle,
}: AndroidTopBarProps) => {
  const styles = useStylesheet(createStyles);
  const { palettes, dark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        dark && styles.containerDark,
        { height: insets.top + 44, paddingTop: insets.top },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel={backAccessibilityLabel}
      >
        <FontAwesomeIcon
          icon={Platform.OS === 'android' ? faArrowLeft : faChevronLeft}
          size={iconSize}
          color={palettes.primary[500]}
        />
      </TouchableOpacity>
      {title ? (
        <Text style={[styles.title, dark && styles.titleDark, titleStyle]}>
          {title}
        </Text>
      ) : null}
      {right ?? <View style={styles.spacer} />}
    </View>
  );
};

const createStyles = ({
  spacing,
  palettes,
  colors,
  fontFamilies,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[1],
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
    },
    containerDark: {
      borderBottomColor: palettes.gray[500],
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: spacing[4],
    },
    title: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      color: palettes.primary[700],
      textAlign: 'center',
    },
    titleDark: {
      color: palettes.gray[50],
    },
    spacer: {
      width: 44,
      height: 44,
    },
  });
