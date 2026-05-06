import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronLeft,
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import { HighlightedName } from '../components/HighlightedName';
import { IosTopBar, IosTopBarTextAction } from '../components/IosTopBar';
import { SCREEN_HORIZONTAL_PADDING } from '../constants';
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
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const route = useRoute<RouteProp<StudentsStackParamList, 'SelectStudents'>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { selectedCourse } = useCourses();

  const students = selectedCourse?.students ?? [];
  const resolvedInitialSelectAll =
    initialSelectAll ?? route.params?.initialSelectAll ?? false;
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(resolvedInitialSelectAll ? students.map(s => s.id) : []),
  );

  const handleClose = () => {
    if (close) {
      close();
      return;
    }
    navigation.goBack();
  };

  const query = searchText.toLowerCase();
  const filteredStudents = students.filter(
    s =>
      s.id.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.surname.toLowerCase().includes(query),
  );

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every(s => selectedIds.has(s.id));

  const handleToggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (isAllSelected) {
        filteredStudents.forEach(s => next.delete(s.id));
      } else {
        filteredStudents.forEach(s => next.add(s.id));
      }
      return next;
    });
  };

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
    Alert.alert(
      t('other.contactSelectedStudents'),
      `${selectedIds.size} ${t('other.students', { defaultValue: 'students' })}`,
    );
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
        <View
          style={[
            styles.topBar,
            dark && styles.topBarDark,
            { height: insets.top + 44, paddingTop: insets.top },
          ]}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={t('common.close', { defaultValue: 'Close' })}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={18}
              color={palettes.primary[500]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleAll}
            style={styles.topBarAction}
            accessibilityRole="button"
            accessibilityLabel={
              isAllSelected
                ? t('common.deselectAll', { defaultValue: 'Deselect all' })
                : t('common.selectAll', { defaultValue: 'Select all' })
            }
          >
            <Text style={styles.headerSelectAll}>
              {isAllSelected ? t('common.deselectAll') : t('common.selectAll')}
            </Text>
          </TouchableOpacity>
        </View>
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

      <CtaButtonContainer absolute={false} style={styles.ctaContainer}>
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
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[1],
      backgroundColor: palettes.gray[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
      paddingHorizontal: spacing[4],
    },
    topBarDark: {
      borderBottomColor: palettes.gray[500],
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    topBarAction: {
      minHeight: 44,
      justifyContent: 'center',
    },
    headerClose: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      color: palettes.gray[500],
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    headerSelectAll: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      color: palettes.primary[500],
      lineHeight: 22,
      letterSpacing: -0.43,
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
