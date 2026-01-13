import React from 'react';
import { TouchableHighlightProps } from 'react-native';

import { DirectoryListItem } from '../../ui/components/DirectoryListItem';

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
  return (
    <DirectoryListItem
      title={name}
      subtitle={`${length} files`}
      onPress={() => {
        setShowDirFiles(true);
        setDirId(dirId);
      }}
      {...rest}
    />
  );
};
