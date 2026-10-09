import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  DropDownIcon,
  IndentedDivider,
  OverviewList,
  Section,
  StatefulMenuView,
  TextButton,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TEACHING_TYPES } from '../../core/constants/teachingTypes';
import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { StaffListItem } from './StaffListItem';

type TeachingTypeCode = (typeof TEACHING_TYPES)[number]['code'];

export const EditLectureStaffModalContent = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const {
    selectedLecture,
    selectedCourse,
    updateCourseLecture,
    setSelectedLecture,
  } = useCourses();

  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();

  const staffList = useMemo(() => {
    const holder =
      selectedCourse?.staff?.filter(
        (staff: Staff) => staff.role === 'Titolare' || staff.role === 'Holder',
      ) ?? [];

    const holderWithTeachingType: Staff[] = holder.map((s: Staff) => ({
      ...s,
      teachingType: s.teachingType ?? 'L',
    }));

    return selectedLecture?.staff ?? holderWithTeachingType;
  }, [selectedLecture, selectedCourse]);

  const initialSelectedStaffTypes = useMemo(() => {
    const initial: Record<number, TeachingTypeCode> = {};
    staffList.forEach(staff => {
      if (staff.teachingType) {
        initial[staff.id] = staff.teachingType;
      }
    });
    return initial;
  }, [staffList]);

  const [selectedStaffTypes, setSelectedStaffTypes] = useState<
    Record<number, TeachingTypeCode>
  >(initialSelectedStaffTypes);

  useEffect(() => {
    setSelectedStaffTypes(initialSelectedStaffTypes);
  }, [initialSelectedStaffTypes]);

  const allStaffHasTeachingType = useMemo(
    () =>
      staffList.every(staff =>
        Boolean(selectedStaffTypes[staff.id] ?? staff.teachingType),
      ),
    [staffList, selectedStaffTypes],
  );

  const canConfirm = allStaffHasTeachingType;

  const getTeachingTypeLabel = (code: string) => {
    return (
      TEACHING_TYPES.find(teachingType => teachingType.code === code)?.label ??
      code
    );
  };

  const handleSelectStaffType = (
    staffId: number,
    staffType: TeachingTypeCode,
  ) => {
    setSelectedStaffTypes(prev => ({
      ...prev,
      [staffId]: staffType,
    }));
  };

  const handleSave = useCallback(() => {
    if (!selectedCourse || !canConfirm) {
      return;
    }

    // If there's an existing selectedLecture, update its staff; otherwise create
    // a new temporary lecture in memory (do NOT add it to the course lessons).
    if (selectedLecture) {
      const updatedLecture = {
        ...selectedLecture,
        staff: staffList.map(staff => ({
          ...staff,
          teachingType: selectedStaffTypes[staff.id] ?? staff.teachingType,
        })),
      };

      // If lecture already exists in course.lessons, update it there; if it's
      // a temporary/unsaved lecture we must NOT add an empty lecture to the
      // course — only update the selectedLecture in memory so AddLectureContent
      // can read the modified staff when the user eventually saves/publishes.
      const lectureExists = selectedCourse.lessons.some(
        l => l.id === selectedLecture.id,
      );

      if (lectureExists) {
        updateCourseLecture(
          selectedCourse.id,
          selectedLecture.id,
          updatedLecture,
        );
      }
      setSelectedLecture(updatedLecture as any);
      navigation.goBack();
      return;
    }

    // No selectedLecture: create a temporary lecture and add it to the course
    const tempLectureId = -Date.now();
    const newLecture = {
      id: tempLectureId,
      title: '',
      date: '',
      time: '',
      content: '',
      staff: staffList.map(staff => ({
        ...staff,
        teachingType: selectedStaffTypes[staff.id] ?? staff.teachingType,
      })),
    } as any;

    // DO NOT add the temporary lecture to the course.lessons. Only set it as
    // the selected lecture so the Add/Edit lecture flow can read the staff
    // without creating an empty persisted lesson.
    setSelectedLecture(newLecture);
    navigation.goBack();
  }, [
    canConfirm,
    navigation,
    selectedCourse,
    selectedLecture,
    staffList,
    selectedStaffTypes,
    updateCourseLecture,
    setSelectedLecture,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          selectedLecture && (
            <TextButton onPress={handleSave}>{t('common.save')}</TextButton>
          )
        );
      },
    });
  }, [navigation, t, handleSave, selectedLecture]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      >
        <Section style={styles.section}>
          <OverviewList indented style={styles.listContainer}>
            {staffList.map((staff, index) => {
              const selectedTeachingTypeCode = selectedStaffTypes[staff.id];
              const selectedTeachingTypeTitle = selectedTeachingTypeCode
                ? `${selectedTeachingTypeCode} - ${getTeachingTypeLabel(selectedTeachingTypeCode)}`
                : t('other.selectTypeOfTeaching');

              const actions: MenuAction[] = TEACHING_TYPES.map(
                teachingType => ({
                  id: teachingType.code,
                  title: `${teachingType.code} - ${teachingType.label}`,
                  state:
                    selectedTeachingTypeCode === teachingType.code
                      ? 'on'
                      : undefined,
                }),
              );

              return (
                <React.Fragment key={staff.id}>
                  <StatefulMenuView
                    title={t('common.staff')}
                    actions={actions}
                    onPressAction={({ nativeEvent: { event } }) => {
                      const selectedType = TEACHING_TYPES.find(
                        teachingType => teachingType.code === event,
                      )?.code;

                      if (!selectedType) {
                        return;
                      }

                      handleSelectStaffType(staff.id, selectedType);
                    }}
                  >
                    <StaffListItem
                      staff={staff}
                      navigateEnabled={false}
                      subtitle={selectedTeachingTypeTitle}
                      trailingItem={
                        <DropDownIcon style={styles.dropDownIcon} />
                      }
                    />
                  </StatefulMenuView>
                  {index < staffList.length - 1 && <IndentedDivider />}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>
        <BottomBarSpacer />
        <CtaButtonSpacer />
      </ScrollView>

      <CtaButtonContainer absolute={Platform.OS === 'android'}>
        <CtaButton
          absolute={false}
          title={t('common.addNewPerson')}
          action={() => {
            navigation.navigate('AddStaff', { from: 'lectureScreen' });
          }}
          icon={faPlus}
        />
      </CtaButtonContainer>
    </SafeAreaView>
  );
};

const createStyles = ({
  spacing,
  colors,
  shapes,
  palettes,
  fontSizes,
}: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      paddingTop: spacing[5],
      gap: spacing[5],
      backgroundColor: colors.background,
    },
    section: {
      marginTop: 0,
      paddingTop: 0,
    },
    headerRow: {
      marginBottom: spacing[5],
    },
    listContainer: {
      borderRadius: shapes.lg,
      elevation: 0,
      marginTop: 0,
      paddingTop: 0,
    },
    divider: {
      marginLeft: spacing[4],
    },
    checkbox: {
      marginLeft: spacing[1],
    },
    selectedTypePill: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[0.5],
      borderRadius: shapes.lg,
      backgroundColor: palettes.gray[200],
    },
    selectedTypeText: {
      fontSize: 12,
      color: palettes.gray[700],
      fontWeight: '600',
    },
    menuContainer: {
      paddingVertical: spacing[2],
      minWidth: 260,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    menuItemText: {
      fontSize: 14,
      color: colors.prose,
      flexShrink: 1,
      paddingRight: spacing[3],
    },
    menuItemIcon: {
      color: palettes.primary[600],
    },
    menuCaption: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[1],
      color: palettes.gray[500],
      fontSize: 12,
    },
    dropDownIcon: {
      marginRight: -spacing[1],
    },
    infoMessage: {
      fontSize: fontSizes.sm,
    },
  });
