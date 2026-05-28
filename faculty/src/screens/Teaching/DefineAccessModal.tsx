import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  BottomModal,
  CtaButton,
  CtaButtonContainer,
  DropDownIcon,
  IndentedDivider,
  InfoMessage,
  OverviewList,
  Section,
  StatefulMenuView,
  Theme,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { STAFF_ACCESS_VALUES } from '../../core/constants/staffAccess';
import { TEACHING_TYPES } from '../../core/constants/teachingTypes';
import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { HandleAccessModalContent } from './HandleAccessModalContent';
import { StaffListItem } from './StaffListItem';

type TeachingTypeCode = (typeof TEACHING_TYPES)[number]['code'];

const normalizeSequentialStaffIds = (staffList: Staff[]) =>
  staffList.map((staff, index) => ({
    ...staff,
    id: index + 1,
  }));

type DefineAccessRouteProp = RouteProp<
  CourseSharedScreensParamList,
  'DefineAccess'
>;

export const DefineAccessModal = () => {
  const route = useRoute<DefineAccessRouteProp>();
  const { addeddStaff, from } = route.params;
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  useTheme();
  const {
    fakeProfiles,
    selectedLecture,
    selectedCourse,
    addStaffToCourse,
    setSelectedProfile,
    updateCourseLecture,
    setSelectedLecture,
  } = useCourses();

  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();

  const {
    open: showBottomModal,
    close: closeBottomModal,
    modal: bottomModal,
  } = useBottomModal();

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
    const initial: Record<number, string> = {};
    addeddStaff.forEach(staff => {
      if (from === 'staffScreen' && staff.access) {
        initial[staff.idProfile] = staff.access;
      } else if (staff.teachingType) {
        initial[staff.idProfile] = staff.teachingType;
      }
    });
    return initial;
  }, [from, addeddStaff]);

  const [selectedStaffTypes, setSelectedStaffTypes] = useState<
    Record<number, string>
  >(initialSelectedStaffTypes);

  const selectedCount = Object.keys(selectedStaffTypes).length;
  const allStaffHasTeachingType = useMemo(
    () => selectedCount === addeddStaff.length,
    [selectedCount, addeddStaff.length],
  );
  const allStaffHasAccessType = useMemo(
    () => selectedCount === addeddStaff.length,
    [selectedCount, addeddStaff.length],
  );

  const canConfirm =
    from === 'staffScreen' ? allStaffHasAccessType : allStaffHasTeachingType;

  const handleConfirmSelection = () => {
    if (from === 'staffScreen') {
      const staffToAdd = addeddStaff
        .map(staff => ({
          ...staff,
          access: selectedStaffTypes[staff.id] ?? staff.access,
          role: staff.role || 'Collaboratore',
        }))
        .filter(staff => Boolean(staff.access));

      if (staffToAdd.length === 0) {
        return;
      }

      if (!selectedCourse) {
        return;
      }

      addStaffToCourse(selectedCourse.id, staffToAdd);
      navigation.pop(2);
      return;
    }

    // lectureScreen flow: include all added staff (they don't have 'access')
    if (!selectedCourse) {
      return;
    }

    const staffToAddForLecture = addeddStaff.map(staff => ({
      ...staff,
      teachingType:
        (selectedStaffTypes[staff.idProfile] as TeachingTypeCode) ??
        staff.teachingType,
      role: staff.role || 'Collaboratore',
    }));

    // If there's no selectedLecture (we're creating a new one), create a
    // temporary lecture object and set it in context so the caller modal can
    // display the newly added staff. We do not call updateCourseLecture in
    // this case because the lecture isn't persisted yet.
    if (!selectedLecture) {
      const tempLectureId = -Date.now();

      // include course holder(s) as initial staff (preserve teachingType if present)
      const holders =
        selectedCourse?.staff?.filter(
          (s: Staff) => s.role === 'Titolare' || s.role === 'Holder',
        ) ?? [];

      const holdersWithType = holders.map((s: Staff) => ({
        ...s,
        teachingType: (selectedStaffTypes[s.id] as TeachingTypeCode) ?? 'L',
      }));

      const newLecture = {
        id: tempLectureId,
        title: '',
        date: '',
        time: '',
        content: '',
        staff: normalizeSequentialStaffIds([
          ...holdersWithType,
          ...staffToAddForLecture,
        ]),
        status: 'draft',
      } as any;

      setSelectedLecture(newLecture);
      navigation.pop(2);
      return;
    }

    const updatedLecture = {
      ...selectedLecture,
      staff: normalizeSequentialStaffIds([
        // preserve/update existing staff teachingType
        ...staffList.map(staff => ({
          ...staff,
          teachingType:
            (selectedStaffTypes[staff.idProfile] as TeachingTypeCode) ??
            staff.teachingType,
        })),
        // include newly added staff for lecture
        ...staffToAddForLecture,
      ]),
    };

    updateCourseLecture(selectedCourse.id, selectedLecture.id, updatedLecture);
    setSelectedLecture(updatedLecture);

    navigation.pop(2);
  };

  const getTeachingTypeLabel = (code: string) => {
    return (
      TEACHING_TYPES.find(teachingType => teachingType.code === code)?.label ??
      code
    );
  };

  const getAccessTypeLabel = (staff: Staff) => {
    const staffAccess = selectedStaffTypes[staff.id] ?? staff.access;

    return staffAccess
      ? staffAccess === STAFF_ACCESS_VALUES.full
        ? t('other.fullAccess')
        : t('other.partialAccess')
      : t('other.noRoleSelected');
  };

  const handleSelectStaffType = (staffId: number, staffType: string) => {
    setSelectedStaffTypes(prev => ({
      ...prev,
      [staffId]: staffType,
    }));
  };

  const openStaffProfile = (staff: Staff) => {
    const profile =
      fakeProfiles.find(item => item.id === (staff.idProfile ?? staff.id)) ??
      null;

    if (!profile) return;

    setSelectedProfile(profile);
    navigation.navigate('Contatto');
  };

  const openAccessStaffModal = (staffIndex: number) => {
    if (!addeddStaff || staffIndex < 0 || staffIndex >= addeddStaff.length) {
      return;
    }
    const selectedStaff = addeddStaff[staffIndex];
    showBottomModal(
      <HandleAccessModalContent
        close={closeBottomModal}
        staff={selectedStaff}
        current={staffIndex + 1}
        total={addeddStaff.length}
        onAccessSaved={access => {
          handleSelectStaffType(selectedStaff.idProfile, access);
        }}
        onPrevious={() => {
          openAccessStaffModal(staffIndex - 1);
        }}
        onNext={() => {
          openAccessStaffModal(staffIndex + 1);
        }}
      />,
    );
  };

  if (!selectedLecture && !addeddStaff) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <BottomModal dismissable {...bottomModal} />

        <Section style={styles.section}>
          <OverviewList indented style={styles.listContainer}>
            {staffList.map(staff => {
              const selectedTeachingTypeCode =
                selectedStaffTypes[staff.idProfile] ?? staff.teachingType;
              const selectedTeachingTypeTitle = selectedTeachingTypeCode
                ? `${selectedTeachingTypeCode} - ${getTeachingTypeLabel(selectedTeachingTypeCode)}`
                : t('other.selectTypeOfTeaching');

              const selectedAccessTypeLabel = getAccessTypeLabel(staff);
              return (
                <React.Fragment key={staff.id}>
                  <StaffListItem
                    staff={staff}
                    navigateEnabled={false}
                    onRowPress={() =>
                      from === 'staffScreen' && openStaffProfile(staff)
                    }
                    subtitle={
                      from === 'staffScreen'
                        ? selectedAccessTypeLabel
                        : selectedTeachingTypeTitle
                    }
                    trailingItem={<View />}
                  />

                  <IndentedDivider />
                </React.Fragment>
              );
            })}
            {addeddStaff.map((staff, index) => {
              const selectedTeachingTypeCode = selectedStaffTypes[staff.id];
              const selectedTeachingTypeTitle = selectedTeachingTypeCode
                ? `${selectedTeachingTypeCode} - ${getTeachingTypeLabel(selectedTeachingTypeCode)}`
                : t('other.selectTypeOfTeaching');

              const selectedAccessTypeLabel = getAccessTypeLabel(staff);

              const actions: MenuAction[] =
                from === 'lectureScreen'
                  ? TEACHING_TYPES.map(teachingType => ({
                      id: teachingType.code,
                      title: `${teachingType.code} - ${teachingType.label}`,
                      state:
                        selectedTeachingTypeCode === teachingType.code
                          ? 'on'
                          : undefined,
                    }))
                  : [];

              return (
                <React.Fragment key={staff.id}>
                  <StatefulMenuView
                    title={t('common.staff')}
                    actions={from === 'lectureScreen' ? actions : []}
                    onPressAction={({ nativeEvent: { event } }) => {
                      from === 'lectureScreen' &&
                        handleSelectStaffType(staff.id, event);
                    }}
                  >
                    <StaffListItem
                      staff={staff}
                      navigateEnabled={false}
                      onRowPress={() =>
                        from === 'staffScreen' && openStaffProfile(staff)
                      }
                      subtitle={
                        from === 'staffScreen'
                          ? selectedAccessTypeLabel
                          : selectedTeachingTypeTitle
                      }
                      trailingItem={
                        from !== 'staffScreen' ? (
                          <DropDownIcon style={styles.dropDownIcon} />
                        ) : undefined
                      }
                      onPress={() => {
                        if (from === 'staffScreen') {
                          const staffIndex = addeddStaff.findIndex(
                            s => s.id === staff.id,
                          );
                          if (staffIndex >= 0) {
                            openAccessStaffModal(staffIndex);
                          }
                        }
                      }}
                    />
                  </StatefulMenuView>
                  {index < addeddStaff.length - 1 && <IndentedDivider />}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>
      </ScrollView>

      <CtaButtonContainer
        absolute={Platform.OS === 'android'}
        style={styles.ctaContainer}
      >
        <View style={styles.messageContainer}>
          {!canConfirm && (
            <InfoMessage
              labelStyle={styles.infoMessage}
              type="warning"
              label={
                from === 'staffScreen'
                  ? t('courseStaffTab.accessInfoMessage')
                  : t('courseStaffTab.typeInfoMessage')
              }
            />
          )}
        </View>
        <CtaButton
          absolute={false}
          title={t('common.confirm')}
          action={handleConfirmSelection}
          disabled={!canConfirm}
          icon={faCheck}
        />
      </CtaButtonContainer>
    </SafeAreaView>
  );
};

const createStyles = ({ spacing, colors, shapes, fontSizes }: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      paddingTop: spacing[5],
      gap: spacing[5],
      backgroundColor: colors.background,
    },
    ctaContainer: {},
    section: {
      marginTop: 0,
      paddingTop: 0,
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
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    dropDownIcon: {
      marginRight: -spacing[1],
    },
    infoMessage: {
      fontSize: fontSizes.sm,
    },
    messageContainer: {
      marginBottom: spacing[5],
      margin: -spacing[5],
    },
  });
