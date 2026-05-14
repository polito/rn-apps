import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  faArrowLeft,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  BottomModal,
  CtaButton,
  CtaButtonContainer,
  DropDownIcon,
  IndentedDivider,
  InfoMessage,
  ModalContent,
  OverviewList,
  Section,
  StatefulMenuView,
  Theme,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TEACHING_TYPES } from '../../core/constants/teachingTypes';
import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import { AddStaffModalContent } from './AddStaffModalContent';
import { HandleAccessModalContent } from './HandleAccessModalContent';
import { StaffListItem } from './StaffListItem';
import { TeachingStackParamList } from './TeachingNavigator';
import { STAFF_ACCESS_VALUES } from './staffAccess';

type Props = {
  addeddStaff?: Staff[]; // If provided, the modal will use this staff list instead of the one from the selected lecture, and it will handle access types instead of teaching types
  close: () => void;
  onBack?: () => void;
};

export const DefineAccessModal = ({ addeddStaff, close, onBack }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors } = useTheme();
  const {
    fakeProfiles,
    selectedLecture,
    selectedCourse,
    addStaffToCourse,
    setSelectedProfile,
  } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const {
    open: showBottomModal,
    close: closeBottomModal,
    modal: bottomModal,
  } = useBottomModal();

  const staffList = useMemo(() => {
    if (addeddStaff) {
      return addeddStaff;
    }

    return selectedLecture?.staff ?? [];
  }, [selectedLecture, addeddStaff]);

  const initialSelectedStaffTypes = useMemo(() => {
    const initial: Record<number, string> = {};
    staffList.forEach(staff => {
      if (addeddStaff && staff.access) {
        initial[staff.id] = staff.access;
      } else if (staff.teachingType) {
        initial[staff.id] = staff.teachingType;
      }
    });
    return initial;
  }, [staffList, addeddStaff]);

  const [selectedStaffTypes, setSelectedStaffTypes] = useState<
    Record<number, string>
  >(initialSelectedStaffTypes);

  const selectedCount = Object.keys(selectedStaffTypes).length;
  const allStaffHasTeachingType = selectedCount === staffList.length;
  const allStaffHasAccessType = selectedCount === staffList.length;

  const canConfirm = addeddStaff
    ? allStaffHasAccessType
    : allStaffHasTeachingType;

  const handleConfirmSelection = () => {
    if (addeddStaff) {
      if (!selectedCourse) {
        close();
        return;
      }

      const staffToAdd = addeddStaff
        .map(staff => ({
          ...staff,
          access: selectedStaffTypes[staff.id] ?? staff.access,
          role: staff.role || 'Collaboratore',
        }))
        .filter(staff => Boolean(staff.access));

      if (staffToAdd.length === 0) {
        close();
        return;
      }

      addStaffToCourse(selectedCourse.id, staffToAdd);
      close();
      return;
    }

    showBottomModal(<AddStaffModalContent close={closeBottomModal} />);
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
          handleSelectStaffType(selectedStaff.id, access);
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
    <ModalContent
      title={t('common.staff')}
      close={close}
      footer={
        <CtaButtonContainer absolute modal>
          {!canConfirm && (
            <InfoMessage
              labelStyle={styles.infoMessage}
              type="warning"
              label={
                addeddStaff
                  ? t('courseStaffTab.accessInfoMessage')
                  : t('courseStaffTab.typeInfoMessage')
              }
            />
          )}
          <View style={styles.footerRow}>
            <CtaButton
              absolute={false}
              action={() => {
                onBack?.();
              }}
              icon={faArrowLeft}
              variant="outlined"
              containerStyle={{ padding: 0 }}
              style={{
                backgroundColor: colors.white as string,
              }}
            />
            <View style={styles.confirmWrapper}>
              <CtaButton
                absolute={false}
                title={
                  addeddStaff ? t('common.confirm') : t('common.addNewPerson')
                }
                action={handleConfirmSelection}
                disabled={!canConfirm}
                icon={addeddStaff ? faCheck : faPlus}
                containerStyle={{ padding: 0 }}
              />
            </View>
          </View>
        </CtaButtonContainer>
      }
    >
      <View style={styles.container}>
        <BottomModal dismissable {...bottomModal} />

        <Section style={styles.section}>
          <OverviewList indented style={styles.listContainer}>
            {staffList.map((staff, index) => {
              const selectedTeachingTypeCode = selectedStaffTypes[staff.id];
              const selectedTeachingTypeTitle = selectedTeachingTypeCode
                ? `${selectedTeachingTypeCode} - ${getTeachingTypeLabel(selectedTeachingTypeCode)}`
                : t('other.selectTypeOfTeaching');

              const selectedAccessTypeLabel = getAccessTypeLabel(staff);

              const actions: MenuAction[] = !addeddStaff
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
                    actions={addeddStaff ? [] : actions}
                    onPressAction={({ nativeEvent: { event } }) => {
                      !addeddStaff && handleSelectStaffType(staff.id, event);
                    }}
                  >
                    <StaffListItem
                      staff={staff}
                      navigateEnabled={false}
                      onRowPress={() => openStaffProfile(staff)}
                      subtitle={
                        addeddStaff
                          ? selectedAccessTypeLabel
                          : selectedTeachingTypeTitle
                      }
                      trailingItem={
                        !addeddStaff ? (
                          <DropDownIcon style={styles.dropDownIcon} />
                        ) : undefined
                      }
                      onPress={() => {
                        if (addeddStaff) {
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
                  {index < staffList.length - 1 && (
                    <IndentedDivider style={styles.divider} />
                  )}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>
      </View>
    </ModalContent>
  );
};

const createStyles = ({ spacing, colors, shapes, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
      gap: spacing[5],
      height: 700,
      backgroundColor: colors.background,
    },
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
    footerRow: {
      flexDirection: 'row',
      gap: spacing[2.5],
      padding: spacing[5],
      alignItems: 'center',
    },
    confirmWrapper: {
      flex: 1,
      gap: spacing[2],
      paddingLeft: 0,
    },
  });
