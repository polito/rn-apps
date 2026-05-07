import { JSX, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  StyleProp,
  StyleSheet,
  TouchableHighlightProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Popover from 'react-native-popover-view';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ListItem, Text, Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from '../../screens/Teaching/TeachingNavigator';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  if (selectedCourse == null) return null;

  return (
    <>
      <ListItem
        title={title}
        subtitle={`${t('newsScreen.createdAt')} ${date} by ${student}`}
        trailingItem={
          <TouchableOpacity
            ref={buttonRef}
            onPress={e => {
              e.stopPropagation(); // Prevents navigation when opening the menu
              setMenuVisible(true);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisV} size={24} />
          </TouchableOpacity>
        }
        onPress={() => {
          // Passing everything the detail screen needs through params
          navigation.navigate('Assignment', {
            assignmentId,
            title,
            date,
            student,
          });
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
              { text: t('common.cancel'), style: 'cancel' },
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
