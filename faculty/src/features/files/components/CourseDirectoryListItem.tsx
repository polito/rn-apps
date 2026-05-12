import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableHighlightProps } from 'react-native';

import { DirectoryListItem } from '@polito/lib/ui';

interface Props {
  name: string;
  length: number;
  showDirFiles: boolean;
  setShowDirFiles: React.Dispatch<React.SetStateAction<boolean>>;
  dirId: number;
  setDirId: React.Dispatch<React.SetStateAction<number>>;
}

export const CourseDirectoryListItem = ({
  name,
  length,
  setShowDirFiles,
  dirId,
  setDirId,
  ...rest
}: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
  const { t } = useTranslation();

  return (
    <DirectoryListItem
      title={name}
      subtitle={t('courseDirectoryScreen.fileCount', {
        count: length,
        defaultValue_one: '{{count}} file',
        defaultValue_other: '{{count}} files',
      })}
      onPress={() => {
        setShowDirFiles(true);
        setDirId(dirId);
      }}
      {...rest}
    />
  );
};
