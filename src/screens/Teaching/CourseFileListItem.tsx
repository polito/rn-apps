import { TouchableHighlightProps } from 'react-native';
 
 import { FileListItem } from '../../ui/components/FileListItem';
 
 import { formatFileDate, formatFileSize } from './files';
import React from 'react';
import { useTranslation } from 'react-i18next';
 
 interface Props {
   isDownloaded: boolean;
   name : string;
   date : string,
   size : number,
   mimeType : string,
   fileId : number
 }
 
 export const CourseFileListItem = ({
    name,
    date,
    size,
    mimeType,
    fileId,
   ...rest
 }: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
  const {t} = useTranslation();
   return (
     <FileListItem
       fileId = {fileId}
       title={name}
       subtitle={`${t('newsScreen.createdAt')} ${
         date
       } - ${size} KB`}
       mimeType = {mimeType}
       {...rest}
     />
   );
 };