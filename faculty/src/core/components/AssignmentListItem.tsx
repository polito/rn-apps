import { JSX, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  StyleProp,
  StyleSheet,
  TouchableHighlightProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Popover from 'react-native-popover-view';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ListItem, Text, Theme, useStylesheet } from '@polito/lib';

import { useCourses } from '../../core/contexts/CoursesContext';

interface Props {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  trailingItem?: JSX.Element;
  sizeInKiloBytes?: number;
  downloadProgress?: number;
  containerStyle?: StyleProp<ViewStyle>;
  mimeType?: string;
  isCorrupted?: boolean;
  assignmentId: number;
  date: string;
  student: string;
}

export const AssignmentListItem = ({
  title,
  date,
  student,
  assignmentId,
}: TouchableHighlightProps & Props) => {
  const styles = useStylesheet(createItemStyles);
  const { selectedCourse, removeAssignmentFromCourse } = useCourses();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null);
  const { t } = useTranslation();
  if (selectedCourse == null) return null;
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
        onPress={() => {
          setMenuVisible(true);
        }}
      />
      <Popover
        isVisible={isMenuVisible}
        from={buttonRef.current}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          onPress={() => {
            Alert.alert(t('other.confirm'), t('other.alertAssignment'), [
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
            ]);
          }}
        >
          <Text style={styles.menuItem}>{t('other.delete')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.menuItem}>{t('other.download')}</Text>
        </TouchableOpacity>
      </Popover>
    </>
  );
};

const createItemStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    fileSize: {
      paddingLeft: spacing[1],
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
