import { useTranslation } from 'react-i18next';
import { TouchableHighlightProps } from 'react-native';

import { FileListItem } from '@polito/lib/ui';

interface Props {
  isDownloaded: boolean;
  name: string;
  date: string;
  size: number;
  mimeType: string;
}

export const CourseFileListItem = ({
  name,
  date,
  size,
  mimeType,
  ...rest
}: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
  const { t } = useTranslation();
  return (
    <FileListItem
      title={name}
      subtitle={`${t('newsScreen.createdAt')} ${date} - ${size} KB`}
      mimeType={mimeType}
      {...rest}
    />
  );
};
