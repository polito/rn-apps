import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronLeft,
  faMinus,
  faPlus,
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
import { useNavigation } from '@react-navigation/native';

import { SearchBar } from '../../../core/components/SearchBar';
import { useCourses } from '../../../core/contexts/CoursesContext';
import { IosTopBar, IosTopBarTextAction } from '../components/IosTapBar';

const mockStudents = [
  { id: 's123456', name: 'Paolo', surname: 'Serra' },
  { id: 's123457', name: 'Angela', surname: 'Vitale' },
  { id: 's123458', name: 'Riccardo', surname: 'Pini' },
  { id: 's123459', name: 'Beatrice', surname: 'Leone' },
  { id: 's123460', name: 'Tommaso', surname: 'Riva' },
  { id: 's123461', name: 'Camilla', surname: 'Marchi' },
  { id: 's123462', name: 'Federica', surname: 'Bianchi' },
  { id: 's123463', name: 'Federica', surname: 'Rossi' },
  { id: 's123464', name: 'Federica', surname: 'Verdi' },
  { id: 's123465', name: 'Federica', surname: 'Chiari' },
];

let studentCounter = 100;
const generateStudentId = (): string => {
  const prefix = 'S32';
  const padded = studentCounter.toString().padStart(4, '0');
  studentCounter++;
  return `${prefix}${padded}`;
};

type MockStudent = (typeof mockStudents)[0];

const HighlightedName = ({
  name,
  surname,
  query,
  nameStyle,
  highlightStyle,
}: {
  name: string;
  surname: string;
  query: string;
  nameStyle: object;
  highlightStyle: object;
}) => {
  if (!query) {
    return (
      <Text style={nameStyle} numberOfLines={1}>
        {name} {surname}
      </Text>
    );
  }

  const full = `${name} ${surname}`;
  const lowerFull = full.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerFull.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return (
      <Text style={nameStyle} numberOfLines={1}>
        {full}
      </Text>
    );
  }

  const before = full.slice(0, matchIndex);
  const match = full.slice(matchIndex, matchIndex + query.length);
  const after = full.slice(matchIndex + query.length);

  return (
    <Text style={nameStyle} numberOfLines={1}>
      {before}
      <Text style={highlightStyle}>{match}</Text>
      {after}
    </Text>
  );
};

type Props = {
  close?: () => void;
};

export const AddStudentsModalContent = ({ close }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, dark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { addStudentsToCourse, selectedCourse } = useCourses();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<MockStudent[]>([]);
  const isConfirmEnabled = selectedStudents.length > 0;
  const handleClose = () => {
    if (close) {
      close();
      return;
    }
    navigation.goBack();
  };

  const filteredStudents = useMemo(() => {
    const query = searchText.toLowerCase();
    return mockStudents.filter(
      s =>
        !selectedStudents.some(sel => sel.id === s.id) &&
        (s.name.toLowerCase().includes(query) ||
          s.surname.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query)),
    );
  }, [searchText, selectedStudents]);

  const handleAdd = (student: MockStudent) => {
    setSelectedStudents(prev => [...prev, student]);
  };

  const handleRemove = (student: MockStudent) => {
    setSelectedStudents(prev => prev.filter(s => s.id !== student.id));
  };

  const handleConfirm = () => {
    if (!selectedCourse) return;
    const newStudents = selectedStudents.map(s => ({
      id: generateStudentId(),
      name: s.name,
      surname: s.surname,
      year: '2025',
      exam: 'no',
      cityOfBirth: 'Torino',
      degreeCourse: 'Informatica',
      passedExams: [],
      passedExamsDate: [],
    }));
    addStudentsToCourse(selectedCourse.id, newStudents);
    handleClose();
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
              label={t('common.close', { defaultValue: 'Close' })}
              onPress={handleClose}
              color={palettes.gray[500]}
              align="left"
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
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={18}
              color={palettes.primary[500]}
            />
          </TouchableOpacity>
          <View style={styles.topBarRightSpacer} />
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          bottomBarAwareStyles,
          { paddingBottom: 0 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchWrapper}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t('other.lookForStudent')}
          />
        </View>

        <View style={styles.listContainer}>
          {selectedStudents.map(student => (
            <View
              key={student.id}
              style={[styles.selectedRow, dark && styles.selectedRowDark]}
            >
              <View style={styles.leadingIconContainer}>
                <FontAwesomeIcon
                  icon={faCircleUser}
                  size={20}
                  color={dark ? palettes.gray[50] : palettes.primary[700]}
                />
              </View>
              <View style={styles.studentContent}>
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
              <TouchableOpacity
                onPress={() => handleRemove(student)}
                style={styles.trailingIconContainer}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
              >
                <FontAwesomeIcon
                  icon={faMinus}
                  size={16}
                  color={dark ? palettes.gray[400] : palettes.primary[600]}
                />
              </TouchableOpacity>
            </View>
          ))}

          {filteredStudents.length > 0 && (
            <View style={styles.availableCard}>
              {filteredStudents.map((student, index) => (
                <View key={student.id}>
                  <View style={styles.availableRow}>
                    <View style={styles.leadingIconContainer}>
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        size={20}
                        color={dark ? palettes.gray[50] : palettes.primary[700]}
                      />
                    </View>
                    <View style={styles.studentContent}>
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
                    <TouchableOpacity
                      onPress={() => handleAdd(student)}
                      style={styles.trailingIconContainer}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        size={16}
                        color={
                          dark ? palettes.gray[400] : palettes.primary[600]
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  {index < filteredStudents.length - 1 && (
                    <View
                      style={[styles.divider, dark && styles.dividerDark]}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <CtaButtonContainer absolute={false} style={styles.footer}>
        <CtaButton
          title={t('other.confirm', { defaultValue: 'Confirm' })}
          action={handleConfirm}
          icon={faCheck}
          disabled={!isConfirmEnabled}
          absolute={false}
          containerStyle={styles.confirmButtonContainer}
          textStyle={
            !isConfirmEnabled && dark
              ? styles.confirmButtonTextDisabledDark
              : undefined
          }
        />
      </CtaButtonContainer>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  spacing,
  palettes,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
}: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 18,
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[1],
      backgroundColor: palettes.gray[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
    },
    topBarDark: {
      borderBottomColor: palettes.gray[500],
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: spacing[4],
    },
    topBarRightSpacer: {
      width: 44,
      height: 44,
    },
    searchWrapper: {
      paddingVertical: spacing[2],
      marginBottom: spacing[3],
    },
    listContainer: {
      gap: spacing[2],
    },
    selectedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      backgroundColor: palettes.gray[200],
      borderRadius: shapes.lg,
      paddingRight: spacing[2],
    },
    selectedRowDark: {
      backgroundColor: palettes.gray[600],
    },
    availableCard: {
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    availableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      paddingRight: spacing[2],
    },
    leadingIconContainer: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing[4],
      flexShrink: 0,
    },
    studentContent: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: spacing[4],
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
    trailingIconContainer: {
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
    footer: {
      paddingHorizontal: 0,
      paddingBottom: spacing[4],
      paddingTop: 0,
    },
    confirmButtonTextDisabledDark: {
      color: palettes.gray[700],
    },
    confirmButtonContainer: {
      paddingTop: 0,
      paddingHorizontal: 18,
      paddingBottom: 0,
    },
  });
