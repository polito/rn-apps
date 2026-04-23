import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import {
  faArrowsRotate,
  faCircleCheck,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { CreateFolderIcon } from './CreateFolderIcon';

export type FileDownloadStatus = 'idle' | 'syncing' | 'downloaded';

interface Props {
  name: string;
  subtitle?: string;
  status: FileDownloadStatus;
  onPress: () => void;
  isFolder?: boolean;
  onLongPress?: () => void;
  onActionPress?: () => void;
  /** Replaces the download/sync trailing control when provided. */
  trailing?: ReactNode;
}

const ACTION_DELAY_MS = 600;

export const CourseFileListItem = ({
  name,
  subtitle,
  status,
  onPress,
  isFolder = false,
  onLongPress,
  onActionPress,
  trailing,
}: Props) => {
  const { palettes, fontSizes, colors, dark, fontWeights } = useTheme();
  const styles = useStylesheet(createStyles);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearActionTimeout = useCallback(() => {
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
      actionTimeoutRef.current = null;
    }
  }, []);

  const handleTrailingActionPress = useCallback(() => {
    if (!onActionPress) {
      return;
    }

    clearActionTimeout();
    actionTimeoutRef.current = setTimeout(() => {
      onActionPress();
      actionTimeoutRef.current = null;
    }, ACTION_DELAY_MS);
  }, [clearActionTimeout, onActionPress]);

  useEffect(() => clearActionTimeout, [clearActionTimeout]);

  const hasBadge = false;
  const trailingIcon = status === 'syncing' ? faArrowsRotate : faDownload;
  const fileIconColor = dark ? palettes.gray[50] : palettes.primary[700];
  const trailingColor =
    status === 'downloaded'
      ? dark
        ? palettes.gray[200]
        : palettes.gray[400]
      : dark
        ? palettes.gray[100]
        : palettes.gray[500];

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      style={styles.row}
    >
      <View style={styles.leadingContainer}>
        <View style={styles.leadingIcon}>
          {isFolder ? (
            <CreateFolderIcon />
          ) : status === 'downloaded' ? (
            <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
              <Path
                d="M6 5.25H11.8594C12.5234 5.25 13.1484 5.52344 13.6172 5.99219L17.7578 10.1328C18.2266 10.6016 18.5 11.2656 18.5 11.9297V18.375H11.625C10.2578 18.375 9.125 19.5078 9.125 20.875V25.25H6C4.63281 25.25 3.5 24.1172 3.5 22.75V7.75C3.5 6.38281 4.63281 5.25 6 5.25ZM16.2344 12.125L11.625 7.55469V11.1875C11.625 11.6953 12.0547 12.125 12.5625 12.125H16.2344ZM11.625 20.0938H12.875C14.1641 20.0938 15.2188 21.1484 15.2188 22.4375C15.2188 23.7266 14.1641 24.7812 12.875 24.7812H12.4062V25.875C12.4062 26.3047 12.0547 26.6562 11.625 26.6562C11.1953 26.6562 10.8438 26.3047 10.8438 25.875V20.875C10.8438 20.4453 11.1953 20.0938 11.625 20.0938ZM12.875 23.2188C13.3047 23.2188 13.6562 22.8672 13.6562 22.4375C13.6562 22.0078 13.3047 21.6562 12.875 21.6562H12.4062V23.2188H12.875ZM16.625 20.0938H17.875C19.0078 20.0938 19.9062 20.9922 19.9062 22.125V24.625C19.9062 25.7578 19.0078 26.6562 17.875 26.6562H16.625C16.1953 26.6562 15.8438 26.3047 15.8438 25.875V20.875C15.8438 20.4453 16.1953 20.0938 16.625 20.0938ZM17.4062 25.0938H17.875C18.1484 25.0938 18.3438 24.8984 18.3438 24.625V22.125C18.3438 21.8516 18.1484 21.6562 17.875 21.6562H17.4062V25.0938ZM20.8438 20.875C20.8438 20.4453 21.1953 20.0938 21.625 20.0938H23.5C23.9297 20.0938 24.2812 20.4453 24.2812 20.875C24.2812 21.3047 23.9297 21.6562 23.5 21.6562H22.4062V22.5938H23.5C23.9297 22.5938 24.2812 22.9453 24.2812 23.375C24.2812 23.8047 23.9297 24.1562 23.5 24.1562H22.4062V25.875C22.4062 26.3047 22.0547 26.6562 21.625 26.6562C21.1953 26.6562 20.8438 26.3047 20.8438 25.875V20.875Z"
                fill={dark ? palettes.gray[50] : palettes.primary[700]}
              />
              <Rect x={3} y={5} width={6} height={6} fill={colors.white} />
              <Path
                d="M6 13.25C3.24609 13.25 1 11.0039 1 8.25C1 5.49609 3.24609 3.25 6 3.25C8.75391 3.25 11 5.49609 11 8.25C11 11.0039 8.75391 13.25 6 13.25ZM8.30469 6.10156C8.08984 5.94531 7.79688 5.98438 7.66016 6.19922L5.31641 9.40234L4.30078 8.38672C4.125 8.21094 3.8125 8.21094 3.63672 8.38672C3.46094 8.58203 3.46094 8.875 3.63672 9.05078L5.04297 10.457C5.14062 10.5547 5.27734 10.6133 5.41406 10.5938C5.55078 10.5938 5.66797 10.5156 5.74609 10.3984L8.40234 6.74609C8.55859 6.55078 8.51953 6.25781 8.30469 6.10156Z"
                fill={palettes.secondary[600]}
              />
            </Svg>
          ) : (
            <Svg width={23} height={22} viewBox="0 0 23 22" fill="none">
              <Path
                d="M4 0.5H9.85938C10.5234 0.5 11.1484 0.773438 11.6172 1.24219L15.7578 5.38281C16.2266 5.85156 16.5 6.51562 16.5 7.17969V13.625H9.625C8.25781 13.625 7.125 14.7578 7.125 16.125V20.5H4C2.63281 20.5 1.5 19.3672 1.5 18V3C1.5 1.63281 2.63281 0.5 4 0.5ZM14.2344 7.375L9.625 2.80469V6.4375C9.625 6.94531 10.0547 7.375 10.5625 7.375H14.2344ZM9.625 15.3438H10.875C12.1641 15.3438 13.2188 16.3984 13.2188 17.6875C13.2188 18.9766 12.1641 20.0312 10.875 20.0312H10.4062V21.125C10.4062 21.5547 10.0547 21.9062 9.625 21.9062C9.19531 21.9062 8.84375 21.5547 8.84375 21.125V16.125C8.84375 15.6953 9.19531 15.3438 9.625 15.3438ZM10.875 18.4688C11.3047 18.4688 11.6562 18.1172 11.6562 17.6875C11.6562 17.2578 11.3047 16.9062 10.875 16.9062H10.4062V18.4688H10.875ZM14.625 15.3438H15.875C17.0078 15.3438 17.9062 16.2422 17.9062 17.375V19.875C17.9062 21.0078 17.0078 21.9062 15.875 21.9062H14.625C14.1953 21.9062 13.8438 21.5547 13.8438 21.125V16.125C13.8438 15.6953 14.1953 15.3438 14.625 15.3438ZM15.4062 20.3438H15.875C16.1484 20.3438 16.3438 20.1484 16.3438 19.875V17.375C16.3438 17.1016 16.1484 16.9062 15.875 16.9062H15.4062V20.3438ZM18.8438 16.125C18.8438 15.6953 19.1953 15.3438 19.625 15.3438H21.5C21.9297 15.3438 22.2812 15.6953 22.2812 16.125C22.2812 16.5547 21.9297 16.9062 21.5 16.9062H20.4062V17.8438H21.5C21.9297 17.8438 22.2812 18.1953 22.2812 18.625C22.2812 19.0547 21.9297 19.4062 21.5 19.4062H20.4062V21.125C20.4062 21.5547 20.0547 21.9062 19.625 21.9062C19.1953 21.9062 18.8438 21.5547 18.8438 21.125V16.125Z"
                fill={fileIconColor}
              />
            </Svg>
          )}
          {hasBadge && (
            <>
              <View
                style={[styles.badgeMask, { backgroundColor: colors.surface }]}
              />
              <View style={styles.badge}>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  size={12.5}
                  color={palettes.secondary[600]}
                />
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: fontSizes.md,
            color: dark ? colors.heading : palettes.text[800],
            fontWeight: fontWeights.medium,
          }}
        >
          {name}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: fontSizes.sm,
              color: dark ? palettes.gray[300] : palettes.text[500],
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing ? (
        <View style={styles.trailingSlot}>{trailing}</View>
      ) : (
        <TouchableOpacity
          onPress={handleTrailingActionPress}
          style={styles.trailingIcon}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
        >
          <FontAwesomeIcon
            icon={trailingIcon}
            size={fontSizes.md}
            color={trailingColor}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      minHeight: 60,
      paddingVertical: spacing[2],
    },
    leadingContainer: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[2],
      flexShrink: 0,
    },
    leadingIcon: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    badgeMask: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 6,
      height: 6,
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflow: 'hidden',
    },
    trailingIcon: {
      width: 24,
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexShrink: 0,
    },
    trailingSlot: {
      minWidth: 28,
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexShrink: 0,
    },
  });
