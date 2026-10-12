import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, TouchableHighlightProps } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { IS_ANDROID, formatDateTime } from '@polito/lib/core';
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
  accessibilityListLabel?: string;
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
  accessibilityListLabel,
  ...rest
}: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
  const { colors, spacing, fontSizes } = useTheme();
  const subTitle = `${formatFileSize(item.sizeInKiloBytes)} - ${formatDateTime(
    item.uploadedAt,
  )}`;
  const listItem = useMemo(
    () => (
      <FileListItem
        onPress={async () => {
          await Linking.openURL(item.url);
        }}
        title={item.description}
        titleStyle={
          item.deletedAt != null && {
            color: colors.secondaryText,
            textDecorationLine: 'line-through',
          }
        }
        subtitle={subTitle}
        accessibilityLabel={`${accessibilityListLabel}. ${item.description}, ${subTitle}`}
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
      item,
      subTitle,
      accessibilityListLabel,
      spacing,
      colors.secondaryText,
      fontSizes.xl,
      rest,
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
