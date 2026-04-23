import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, useTheme } from '@polito/lib/ui';
import { BlurView } from '@react-native-community/blur';

export interface ContextMenuItem {
  label: string;
  onPress: () => void;
  checked?: boolean;
  trailingIcon?: IconDefinition;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  anchorPosition?: { top: number; left?: number; right?: number };
  /** Figma "Open overlay" uses Animate: Instant — default none. */
  animationType?: 'none' | 'fade' | 'slide';
}

export const CourseFilesContextMenu = ({
  visible,
  onClose,
  items,
  anchorPosition = { top: 100, right: 16 },
  animationType = 'none',
}: Props) => {
  const { colors, dark, fontSizes, palettes } = useTheme();
  // Keep menu colors aligned with native menus in both themes.
  const menuLabelColor = dark ? palettes.gray[50] : '#383838';
  const backdropColor = `${colors.black}40`;
  const menuBackgroundColor = dark
    ? `${palettes.gray[800]}D9`
    : `${palettes.gray[50]}B3`;
  const menuSeparatorColor = dark
    ? 'rgba(255, 255, 255, 0.22)'
    : 'rgba(128, 128, 128, 0.55)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: backdropColor }]}
        onPress={onClose}
      >
        <View
          style={[
            styles.menu,
            {
              top: anchorPosition.top,
              shadowColor: colors.black,
              backgroundColor: menuBackgroundColor,
              ...(anchorPosition.left !== undefined
                ? { left: anchorPosition.left }
                : {}),
              ...(anchorPosition.right !== undefined
                ? { right: anchorPosition.right }
                : {}),
            },
          ]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={dark ? 'dark' : 'light'}
            blurAmount={25}
            reducedTransparencyFallbackColor={
              dark ? palettes.gray[800] : palettes.gray[200]
            }
          />

          {items.map((item, index) => (
            <TouchableOpacity
              key={`${item.label}-${index}`}
              onPress={() => {
                item.onPress();
                onClose();
              }}
              accessibilityRole="button"
              style={[
                styles.item,
                item.checked !== undefined
                  ? styles.itemChecked
                  : styles.itemPlain,
                index < items.length - 1 && {
                  borderBottomColor: menuSeparatorColor,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              {item.checked !== undefined && (
                <View style={styles.checkContainer}>
                  {item.checked && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      size={fontSizes.md}
                      color={menuLabelColor}
                    />
                  )}
                </View>
              )}
              <Text
                style={[styles.label, { color: menuLabelColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.label}
              </Text>
              {item.trailingIcon && (
                <View style={styles.trailingContainer}>
                  <FontAwesomeIcon
                    icon={item.trailingIcon}
                    size={fontSizes.md}
                    color={menuLabelColor}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  item: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  itemPlain: {
    paddingLeft: 31,
  },
  itemChecked: {
    paddingLeft: 7,
  },
  checkContainer: {
    width: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontFamily: 'SF Pro',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
  },
  trailingContainer: {
    width: 20,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
