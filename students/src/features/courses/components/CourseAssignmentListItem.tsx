import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, TouchableHighlightProps } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { IS_ANDROID, IS_IOS, formatDateTime } from '@polito/lib/core';
import { FileListItem, IconButton, useTheme } from '@polito/lib/ui';
import { CourseAssignment } from '@polito/student-api-client';

import { formatFileSize } from '~/utils/files';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';

interface Props {
  item: CourseAssignment;
  index: number;
  total: number;
}

const Menu = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const { dark, colors } = useTheme();

  return (
    <ContextMenu
      dropdownMenuMode={IS_ANDROID}
      actions={[
        {
          title: t('common.retract'),
          titleColor: dark ? colors.white : colors.black,
          destructive: true,
        },
      ]}
      onPress={({ nativeEvent: { index } }) => {
        switch (index) {
          case 0:
            // TODO retract assignment
            break;
          default:
        }
      }}
    >
      {children}
    </ContextMenu>
  );
};

export const CourseAssignmentListItem = ({
  item,
  index,
  total,
  ...rest
}: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
  const { t } = useTranslation();
  const { colors, spacing, fontSizes } = useTheme();
  const { buildCompositeListLabel } = useAccessibility();
  const subTitle = `${formatFileSize(item.sizeInKiloBytes)} - ${formatDateTime(
    item.uploadedAt,
  )}`;
  const accessibilityLabel = buildCompositeListLabel(
    [
      item.description,
      item.deletedAt ? t('common.retracted') : '',
      subTitle,
      t('common.downloadClick'),
      IS_IOS ? t('courseAssignmentsTab.longPress') : '',
    ].filter(Boolean),
    index,
    total,
  );
  const listItem = useMemo(
    () => (
      <FileListItem
        onPress={async () => {
          await Linking.openURL(item.url);
        }}
        title={item.description}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        titleStyle={{
          textDecorationLine:
            item.deletedAt != null ? 'line-through' : undefined,
        }}
        subtitle={subTitle}
        mimeType={item.mimeType}
        trailingItem={
          item.deletedAt == null
            ? Platform.select({
                android: (
                  <Menu>
                    <IconButton
                      style={{
                        padding: spacing[3],
                      }}
                      icon={faEllipsisVertical}
                      accessibilityLabel={t('common.options')}
                      color={colors.secondaryText}
                      size={fontSizes.xl}
                      hitSlop={{
                        right: +spacing[2],
                        left: +spacing[2],
                      }}
                    />
                  </Menu>
                ),
              })
            : undefined
        }
        {...rest}
      />
    ),
    [
      t,
      item,
      subTitle,
      spacing,
      colors.secondaryText,
      fontSizes.xl,
      rest,
      accessibilityLabel,
    ],
  );

  if (Platform.OS === 'ios') {
    return <Menu>{listItem}</Menu>;
  }
  return listItem;
};
