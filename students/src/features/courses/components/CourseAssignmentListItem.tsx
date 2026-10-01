import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, TouchableHighlightProps } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import {
  IS_ANDROID,
  IS_IOS,
  formatDateTime,
  useAccessibility,
} from '@polito/lib/core';
import { FileListItem, IconButton, useTheme } from '@polito/lib/ui';
import { CourseAssignment } from '@polito/student-api-client';

import {
  useRestoreAssignment,
  useWithdrawAssignment,
} from '~/core/queries/courseHooks';
import { formatFileSize } from '~/utils/files';

import { useCourseContext } from '../contexts/CourseContext';

interface Props {
  item: CourseAssignment;
  index: number;
  total: number;
}

const Menu = ({
  assignmentId,
  isWithdrawn,
  children,
}: PropsWithChildren<{ assignmentId: number; isWithdrawn: boolean }>) => {
  const { t } = useTranslation();
  const { dark, colors } = useTheme();
  const courseId = useCourseContext();
  const { mutate: withdrawAssignment } = useWithdrawAssignment(courseId);
  const { mutate: restoreAssignment } = useRestoreAssignment(courseId);

  return (
    <ContextMenu
      dropdownMenuMode={IS_ANDROID}
      actions={[
        {
          title: isWithdrawn ? t('common.restore') : t('common.withdraw'),
          titleColor: dark ? colors.white : colors.black,
          destructive: !isWithdrawn,
        },
      ]}
      onPress={({ nativeEvent: { index } }) => {
        switch (index) {
          case 0:
            if (isWithdrawn) {
              restoreAssignment(assignmentId);
            } else {
              withdrawAssignment(assignmentId);
            }
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
        titleStyle={
          item.deletedAt != null && {
            color: colors.secondaryText,
            textDecorationLine: 'line-through',
          }
        }
        subtitle={subTitle}
        mimeType={item.mimeType}
        iconColor={item.deletedAt != null ? colors.secondaryText : undefined}
        trailingItem={Platform.select({
          android: (
            <Menu assignmentId={item.id} isWithdrawn={item.deletedAt != null}>
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
        })}
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
    return (
      <Menu assignmentId={item.id} isWithdrawn={item.deletedAt != null}>
        {listItem}
      </Menu>
    );
  }
  return listItem;
};
