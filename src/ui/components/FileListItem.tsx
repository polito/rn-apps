import { Alert, StyleProp, StyleSheet, TouchableHighlightProps, TouchableOpacity, View, ViewStyle } from 'react-native';
 
 import { ListItem } from './ListItem';
 import { useStylesheet } from '../hooks/useStylesheet';
 import { Theme } from '../types/theme';
import { JSX, useRef, useState } from 'react';
import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faEllipsisV,
  faExclamationCircle,
  faFile,
  faFileAudio,
  faFileCode,
  faFileCsv,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  faFileZipper,
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../hooks/useTheme';
import { useOfflineDisabled } from '../../core/hooks/useOfflineDisabled';
import { Icon } from './Icon';
import { Pie as ProgressIndicator } from 'react-native-progress';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useCourses } from '../../core/contexts/CoursesContext';
import Popover from 'react-native-popover-view';
import { Text } from './Text';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type IconType = string;

const mimeTypeIcons: Record<IconType, IconDefinition> = {
  pdf: faFilePdf,
  image: faFileImage,
  word: faFileWord,
  excel: faFileExcel,
  zip: faFileZipper,
  tar: faFileZipper,
  gz: faFileZipper,
  rar: faFileZipper,
  video: faFileVideo,
  powerpoint: faFilePowerpoint,
  csv: faFileCsv,
  xml: faFileCode,
  audio: faFileAudio,
  html: faFileCode,
  javascript: faFileCode,
  json: faFileCode,
  iso: faFileZipper,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '7z': faFileZipper,
};

const getIconFromMimeType = (mimeType?: string) => {
  if (!mimeType) return faFile;
  const keywords = new RegExp(Object.keys(mimeTypeIcons).join('|'), 'i');
  const match = mimeType.match(keywords);
  const type = match?.[0];
  if (type && type in mimeTypeIcons) {
    return mimeTypeIcons[type];
  }
  return faFile;
};



 interface Props {
   title: string | JSX.Element;
   subtitle?: string | JSX.Element;
   trailingItem?: JSX.Element;
   isDownloaded: boolean;
   sizeInKiloBytes?: number;
   downloadProgress?: number;
   containerStyle?: StyleProp<ViewStyle>;
   mimeType?: string;
   isCorrupted?: boolean;
   fileId : number;
 }
 
 export const FileListItem = ({
  isDownloaded = false,
  downloadProgress,
  subtitle,
  mimeType,
  isCorrupted = false,
  fileId,
  ...rest
 }: TouchableHighlightProps & Props) => {
   const styles = useStylesheet(createItemStyles);
   const { palettes, fontSizes } = useTheme();
   const downloadLabel = (`common.downloadStatus.${isDownloaded}`);
   const isDisabled = useOfflineDisabled(() => !isDownloaded);
  const { selectedCourse , removeAssignmentFromCourse, removeFileFromCourse, selectedFile, setSelectedFile} = useCourses();
  if(selectedCourse == null)return null
    const [isMenuVisible, setMenuVisible] = useState(false);
    const buttonRef = useRef(null);
 const navigation = useNavigation()
 const {t} = useTranslation()

   return (
    <>
     <ListItem
        accessible={true}
        accessibilityLabel={`${rest.title} ${subtitle}.${mimeType} ${downloadLabel}`}
      trailingItem={
        <View ref={buttonRef}>
      <FontAwesomeIcon icon={faEllipsisV} size={24} />
      </View>
    }
        onPress={ ()=>{
          const foundFile = selectedCourse.directories.flatMap(dir => dir.files).find(f => f.id === fileId)
          if(foundFile)setSelectedFile(foundFile)
          setMenuVisible(true)
        }}



       leadingItem={
         <View>
            <Icon icon={getIconFromMimeType(mimeType)} size={fontSizes['2xl']} />
            {downloadProgress != null ? (
            <View style={styles.downloadedIconContainer}>
              <ProgressIndicator
                progress={downloadProgress}
                size={12}
                color={palettes.secondary[600]}
              />
            </View>
          ) : (
            isDownloaded &&
            (!isCorrupted ? (
              <View style={styles.downloadedIconContainer}>
                <Icon
                  icon={faCheckCircle}
                  size={12}
                  color={palettes.secondary[600]}
                />
              </View>
            ) : (
              <View style={styles.downloadedIconContainer}>
                <Icon
                  icon={faExclamationCircle}
                  size={12}
                  color={palettes.danger[600]}
                />
              </View>
            ))
          )}
        </View>
      }
      subtitle={subtitle}
      disabled={isDisabled}
      {...rest}
    />
    <Popover
      isVisible={isMenuVisible}
      from={buttonRef}
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity onPress={() => {
        setMenuVisible(false);
        navigation.navigate('ModifyFile');
      }}>
        <Text style={styles.menuItem}>{t('other.modify')}</Text>
      </TouchableOpacity>

     <TouchableOpacity onPress={() => {
  Alert.alert(
    t('other.confirm'),
    t('other.alertFile2'),
    [
      {
        text: t('common.cancel'),
        style: 'cancel',
        onPress: () => setMenuVisible(false),
      },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: () => {
          setMenuVisible(false);
          removeFileFromCourse(selectedCourse.id, fileId);
        },
      },
    ]
  );
}}>
  <Text style={styles.menuItem}>{t('other.delete')}</Text>
</TouchableOpacity>


      <TouchableOpacity onPress={() => {
        setMenuVisible(false);
        console.log('Scarica file');
      }}>
        <Text style={styles.menuItem}>{t('other.download')}</Text>
      </TouchableOpacity>
    </Popover>
    </>
   );
 };
 
 const createItemStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    fileSize: {
      paddingLeft: spacing[1] ,
    },
    downloadedIconContainer: {
      padding: 2,
      borderRadius: 16,
      backgroundColor: colors.background,
      position: 'absolute',
      top: -5,
      left: -8,
    },
    subtitle: {
      flexShrink: 1,
    },
    menuItem: {
      padding: 10,
      fontSize: 16,
    },
  });