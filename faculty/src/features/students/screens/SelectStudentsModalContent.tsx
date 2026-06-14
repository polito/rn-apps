import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faEnvelope,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  CtaButton,
  CtaButtonContainer,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ContextMenuItem,
  CourseFilesContextMenu,
} from '../../../core/components/CourseFilesContextMenu';
import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import { AndroidTopBar } from '../components/AndroidTopBar';
import {
  ContactMethod,
  ContactMethodOverlay,
} from '../components/ContactMethodOverlay';
import { HighlightedName } from '../components/HighlightedName';
import { IosTopBar, IosTopBarTextAction } from '../components/IosTopBar';
import { SCREEN_HORIZONTAL_PADDING } from '../constants';
import { useFilteredStudents } from '../hooks';
import { StudentsStackParamList } from '../types/navigation';

type Props = {
  close?: () => void;
  initialSelectAll?: boolean;
};

export const SelectStudentsModalContent = ({
  close,
  initialSelectAll,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, dark, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const route = useRoute<RouteProp<StudentsStackParamList, 'SelectStudents'>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { selectedCourse } = useCourses();

  const students = selectedCourse?.students ?? [];
  const resolvedInitialSelectAll =
    initialSelectAll ?? route.params?.initialSelectAll ?? false;
  const [searchText, setSearchText] = useState('');
  const [isEllipsisMenuVisible, setEllipsisMenuVisible] = useState(false);
  const [ellipsisAnchorPosition, setEllipsisAnchorPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 170, left: SCREEN_HORIZONTAL_PADDING });
  const ellipsisButtonRef = useRef<View>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(resolvedInitialSelectAll ? students.map(s => s.id) : []),
  );
  const [isContactMethodVisible, setContactMethodVisible] = useState(false);

  const handleClose = () => {
    if (close) {
      close();
      return;
    }
    navigation.goBack();
  };

  const filteredStudents = useFilteredStudents(students, searchText);

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every(s => selectedIds.has(s.id));

  const handleToggleAll = useCallback(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (isAllSelected) {
        filteredStudents.forEach(s => next.delete(s.id));
      } else {
        filteredStudents.forEach(s => next.add(s.id));
      }
      return next;
    });
  }, [filteredStudents, isAllSelected]);

  const ellipsisMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: isAllSelected
          ? t('common.deselectAll', { defaultValue: 'Deselect all' })
          : t('common.selectAll', { defaultValue: 'Select all' }),
        onPress: () => {
          setEllipsisMenuVisible(false);
          handleToggleAll();
        },
      },
    ],
    [handleToggleAll, isAllSelected, t],
  );

  const handleToggleStudent = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContact = () => {
    setContactMethodVisible(true);
  };

  const handleContactMethodContinue = (method: ContactMethod) => {
    setContactMethodVisible(false);
    const ids = Array.from(selectedIds);
    if (method === 'email') {
      navigation.navigate('EmailCompose', { selectedIds: ids });
      return;
    }
    if (method === 'notify') {
      navigation.navigate('NotifyCompose', { selectedIds: ids });
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <IosTopBar
          backgroundColor={colors.surface}
          grabberColor={dark ? palettes.gray[500] : palettes.gray[400]}
          dividerColor={dark ? palettes.gray[500] : palettes.gray[300]}
          left={
            <IosTopBarTextAction
              label={t('common.close')}
              onPress={handleClose}
              color={palettes.gray[500]}
              align="left"
            />
          }
          right={
            <IosTopBarTextAction
              label={
                isAllSelected ? t('common.deselectAll') : t('common.selectAll')
              }
              onPress={handleToggleAll}
              color={palettes.primary[500]}
              align="right"
            />
          }
        />
      ) : (
        <AndroidTopBar
          onBack={handleClose}
          backAccessibilityLabel={t('common.close', { defaultValue: 'Close' })}
          title={t('common.selectAll', { defaultValue: 'Select all' })}
          right={
            <TouchableOpacity
              ref={ellipsisButtonRef}
              onPress={() => {
                const node = ellipsisButtonRef.current;
                if (node?.measureInWindow) {
                  node.measureInWindow(
                    (x: number, y: number, w: number, h: number) => {
                      setEllipsisAnchorPosition({
                        top: y + h - 2,
                        left: Math.max(SCREEN_HORIZONTAL_PADDING, x + w - 250),
                      });
                      setEllipsisMenuVisible(true);
                    },
                  );
                } else {
                  setEllipsisMenuVisible(true);
                }
              }}
              style={styles.topBarAction}
              accessibilityRole="button"
              accessibilityLabel={t('common.moreOptions', {
                defaultValue: 'More options',
              })}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size={18}
                color={palettes.primary[400]}
              />
            </TouchableOpacity>
          }
        />
      )}

      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t('other.searchForStudent')}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={bottomBarAwareStyles}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredStudents.length > 0 && (
          <View style={styles.card}>
            {filteredStudents.map((student, index) => (
              <View key={student.id}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleToggleStudent(student.id)}
                  activeOpacity={0.6}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selectedIds.has(student.id) }}
                  accessibilityLabel={`${student.name} ${student.surname} (${student.id})`}
                >
                  <View style={styles.rowContent}>
                    <HighlightedName
                      name={student.name}
                      surname={student.surname}
                      query={searchText}
                      nameStyle={[
                        styles.studentName,
                        dark && styles.studentNameDark,
                      ]}
                      highlightStyle={styles.studentNameHighlight}
                    />
                    <Text style={styles.studentId}>{student.id}</Text>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <FontAwesomeIcon
                      icon={
                        selectedIds.has(student.id) ? faSquareCheck : faSquare
                      }
                      size={16}
                      color={palettes.gray[500]}
                    />
                  </View>
                </TouchableOpacity>
                {index < filteredStudents.length - 1 && (
                  <View style={[styles.divider, dark && styles.dividerDark]} />
                )}
              </View>
            ))}
          </View>
        )}
        <View style={styles.scrollSpacer} />
      </ScrollView>

      <CtaButtonContainer
        absolute={false}
        style={[
          styles.ctaContainer,
          Platform.OS === 'android'
            ? { paddingBottom: bottomTabBarHeight }
            : undefined,
        ]}
      >
        <CtaButton
          title={t('other.contactSelected', {
            defaultValue: 'Contact selected',
          })}
          action={handleContact}
          icon={faEnvelope}
          disabled={selectedIds.size === 0}
          absolute={false}
          containerStyle={styles.ctaButtonContainer}
          textStyle={
            selectedIds.size === 0 && dark
              ? styles.ctaTextDisabledDark
              : undefined
          }
        />
      </CtaButtonContainer>
      <CourseFilesContextMenu
        visible={isEllipsisMenuVisible}
        onClose={() => setEllipsisMenuVisible(false)}
        items={ellipsisMenuItems}
        anchorPosition={ellipsisAnchorPosition}
      />
      <ContactMethodOverlay
        visible={isContactMethodVisible}
        selectedCount={selectedIds.size}
        onClose={() => setContactMethodVisible(false)}
        onContinue={handleContactMethodContinue}
      />
    </SafeAreaView>
  );
};

const createStyles = ({
  spacing,
  palettes,
  colors,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topBarAction: {
      width: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: spacing[4],
    },
    searchWrapper: {
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      marginTop: spacing[3],
      paddingVertical: spacing[2],
    },
    scroll: {
      flex: 1,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      overflow: 'hidden',
      marginHorizontal: SCREEN_HORIZONTAL_PADDING,
      marginTop: spacing[2.5],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      paddingLeft: spacing[4],
      paddingRight: spacing[2],
    },
    rowContent: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    studentName: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: palettes.text[800],
      lineHeight: 24,
    },
    studentNameDark: {
      color: palettes.gray[50],
    },
    studentNameHighlight: {
      color: palettes.secondary[600],
    },
    studentId: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      color: palettes.gray[500],
      lineHeight: 21,
    },
    checkboxContainer: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    divider: {
      height: 1,
      backgroundColor: palettes.gray[300],
      marginLeft: spacing[4],
    },
    dividerDark: {
      backgroundColor: palettes.gray[500],
    },
    scrollSpacer: {
      height: spacing[4],
    },
    ctaContainer: {
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: spacing[4],
    },
    ctaTextDisabledDark: {
      color: palettes.gray[700],
    },
    ctaButtonContainer: {
      paddingTop: 0,
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      paddingBottom: 0,
    },
  });
