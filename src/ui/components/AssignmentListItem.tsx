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




 interface Props {
   title: string | JSX.Element;
   subtitle?: string | JSX.Element;
   trailingItem?: JSX.Element;
   sizeInKiloBytes?: number;
   downloadProgress?: number;
   containerStyle?: StyleProp<ViewStyle>;
   mimeType?: string;
   isCorrupted?: boolean;
   assignmentId : number;
   date : string; 
   student : string; 
 }
 
 export const AssignmentListItem = ({
  title,
  subtitle,
  date,
  student,
  mimeType,
  isCorrupted = false,
  assignmentId,
  ...rest
 }: TouchableHighlightProps & Props) => {
   const styles = useStylesheet(createItemStyles);
   const { colors, fontSizes } = useTheme();
   const { selectedCourse , removeAssignmentFromCourse, removeFileFromCourse, selectedFile, setSelectedFile} = useCourses();
   if(selectedCourse == null)return null
   const [isMenuVisible, setMenuVisible] = useState(false);
   const buttonRef = useRef(null);
   const navigation = useNavigation()
   const {t} = useTranslation()
   return (
    <>
        <ListItem
            title={title}
            subtitle={`${t('newsScreen.createdAt')} ${date} by ${student}`}
            trailingItem={ 
            <View ref={buttonRef}>
            <FontAwesomeIcon icon={faEllipsisV} size={24} />
            </View>
            }
            onPress={ ()=> {
            setMenuVisible(true)
            }}
            
            />
        <Popover
        isVisible={isMenuVisible}
        from={buttonRef}
        onRequestClose={() => setMenuVisible(false)}
        >
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            t('other.confirm'),
            t('other.alertAssignment'),
            [
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
              {
                text: t('other.confirm'),
                style: 'destructive',
                onPress: () => {
                  removeAssignmentFromCourse(selectedCourse.id, assignmentId);
                  setMenuVisible(false);
                },
              },
            ]
          );
        }}
      >
  <Text style={styles.menuItem}>{t('other.delete')}</Text>
</TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('pressed delete')}>
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