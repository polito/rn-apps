import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import {
  faCalendar,
  faChevronDown,
  faClock,
  faLanguage,
  faLocationDot,
  faPaperPlane,
  faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons';
import {
  APP_TIMEZONE,
  formatDateTimeAccessibility,
  formatMachineDate,
  usePreferencesContext,
} from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  Col,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  DropDownIcon,
  Icon,
  IndentedDivider,
  ListItem,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  StatefulMenuView,
  Text,
  TextButton,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppPreferences } from '~/core/types/preferences';

import { DateTime } from 'luxon';

import { getTeachingTypeTitle } from '../../core/constants/teachingTypes';
import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { StaffListItem } from './StaffListItem';

const OTHER_INFO_FIELDS = [
  {
    id: 'room',
    icon: faLocationDot,
    labelKey: 'other.room',
    getValue: (lecture: any) => lecture?.room,
  },
  {
    id: 'language',
    icon: faLanguage,
    labelKey: 'common.language',
    getValue: (lecture: any) => lecture?.language,
  },
  {
    id: 'team',
    icon: faPeopleGroup,
    labelKey: 'other.team',
    getValue: (lecture: any, course: any) => {
      if (!lecture?.team || !course?.teams) return null;
      const team = course.teams.find((t: any) => t.id === lecture.team);
      return team?.title;
    },
  },
];

export const AddOrEditLectureModalContent = () => {
  const styles = useStylesheet(createStyles);
  const {
    selectedCourse,
    setSelectedProfile,
    addLesson,
    selectedLecture,
    setSelectedLecture,
    updateCourseLecture,
  } = useCourses(); // Recupero i corsi dal context
  const { fontSizes, palettes, spacing } = useTheme();
  const { t } = useTranslation();
  const { fakeProfiles } = useCourses();
  const { language } = usePreferencesContext<AppPreferences>();
  const today = useMemo(
    () => DateTime.now().setZone(APP_TIMEZONE).toJSDate(),
    [],
  );

  const [date, setDate] = useState<Date | null>(
    selectedLecture?.date ? new Date(selectedLecture.date) : null,
  );
  const [time, setTime] = useState<Date | null>(
    selectedLecture?.date && selectedLecture?.time
      ? new Date(
          `${selectedLecture.date}T${selectedLecture.time.split('-')[0]}`,
        )
      : null,
  );
  const [activeField, setActiveField] = useState<'date' | 'time' | null>(null);
  const [title, _setTitle] = useState<string>(selectedLecture?.title ?? '');
  const [topic, setTopic] = useState<string>(selectedLecture?.content ?? '');

  const [selectedStaff, setSelectedStaff] = useState<Staff[]>(() => {
    if (selectedLecture && selectedLecture.staff) return selectedLecture.staff;
    const holder =
      selectedCourse?.staff?.filter(
        (staff: Staff) => staff.role === 'Titolare' || staff.role === 'Holder',
      ) ?? [];

    const holderWithTeachingType: Staff[] = holder.map((s: Staff) => ({
      ...s,
      teachingType: s.teachingType ?? 'L',
    }));

    return holderWithTeachingType;
  });

  // keep selectedStaff in sync when selectedLecture changes (or course holders change)
  React.useEffect(() => {
    if (selectedLecture?.staff && selectedLecture.staff.length > 0) {
      setSelectedStaff(selectedLecture.staff);
    } else {
      const holders =
        selectedCourse?.staff?.filter(
          (staff: Staff) =>
            staff.role === 'Titolare' || staff.role === 'Holder',
        ) ?? [];

      setSelectedStaff(
        holders.map((s: Staff) => ({
          ...s,
          teachingType: s.teachingType ?? 'L',
        })),
      );
    }
  }, [selectedLecture, selectedCourse]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    selectedLecture?.language ?? '',
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    selectedLecture?.room ?? '',
  );
  const [selectedTeam, setSelectedTeam] = useState<string>(
    selectedLecture?.team
      ? 'Team ' + String(selectedLecture.team)
      : t('common.allStudents'),
  );

  const [isDateSelected, setIsDateSelected] = useState(
    selectedLecture?.date ? true : false,
  );
  const [isTimeSelected, setIsTimeSelected] = useState(
    selectedLecture?.time ? true : false,
  );

  const formatDate = (newdate: Date) => {
    const day = String(newdate.getDate()).padStart(2, '0');
    const month = String(newdate.getMonth() + 1).padStart(2, '0');
    const year = newdate.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();

  const handleDateChange = useCallback(
    (selectedDate: Date) => {
      if (selectedDate && activeField) {
        if (activeField === 'date') {
          setDate(selectedDate);
          setIsDateSelected(true);
        } else {
          setTime(selectedDate);
          setIsTimeSelected(true);
        }
        setActiveField(null);
      }
    },
    [activeField],
  );
  const handleSaveAndExit = () => {
    Alert.alert(
      t('common.confirm'),
      t('courseLecturesScreen.alertEditLecture'),
      [
        {
          text: t('common.no'),
          style: 'cancel',
        },
        {
          text: t('common.yes'),
          onPress: () => {
            if (!selectedCourse) {
              navigation.goBack();
              return;
            }

            if (selectedLecture) {
              const updatedLecture = {
                ...selectedLecture,
                title: title.trim(),
                content: topic.trim(),
                room: selectedRoom ? selectedRoom : selectedLecture.room,
                // persist machine date (YYYY-MM-DD) so formatDateFromString can parse it
                date: date ? formatMachineDate(date) : selectedLecture.date,
                time: time
                  ? (() => {
                      const pad = (n: number) => String(n).padStart(2, '0');
                      const startH = time.getHours();
                      const startM = time.getMinutes();
                      const start = `${pad(startH)}:${pad(startM)}`;
                      const endDate = new Date(time.getTime() + 90 * 60000);
                      const endH = endDate.getHours();
                      const endM = endDate.getMinutes();
                      const end = `${pad(endH)}:${pad(endM)}`;
                      return `${start}-${end}`;
                    })()
                  : selectedLecture.time,
                language: selectedLanguage,
                team: (() => {
                  if (!selectedCourse?.teams) return undefined;
                  if (selectedTeam === t('common.allStudents'))
                    return undefined;
                  const teamObj = selectedCourse.teams.find(
                    (tm: any) => tm.title === selectedTeam,
                  );
                  return teamObj ? teamObj.id : selectedLecture.team;
                })(),
                // if we are saving from the edit flow, compiled status should replace draft
                status: 'compiled',
              } as any;

              const lectureExists = selectedCourse.lessons.some(
                lesson => lesson.id === selectedLecture.id,
              );

              if (lectureExists) {
                updateCourseLecture(
                  selectedCourse.id,
                  selectedLecture.id,
                  updatedLecture,
                );
              } else {
                addLesson(selectedCourse.id, updatedLecture);
              }

              setSelectedLecture(updatedLecture as any);
            } else {
              const teamId = (() => {
                if (!selectedCourse?.teams) return undefined;
                if (selectedTeam === t('common.allStudents')) return undefined;
                const teamObj = selectedCourse.teams.find(
                  (tm: any) => tm.title === selectedTeam,
                );
                return teamObj && teamObj.id;
              })();

              const nextId =
                selectedCourse.lessons && selectedCourse.lessons.length > 0
                  ? Math.max(...selectedCourse.lessons.map(l => l.id)) + 1
                  : 1;

              const newLesson = {
                id: nextId,
                title: title.trim(),
                // store machine date (YYYY-MM-DD) so parsers like fromISO work
                date: date ? formatMachineDate(date) : undefined,
                time: time
                  ? (() => {
                      const pad = (n: number) => String(n).padStart(2, '0');
                      const startH = time.getHours();
                      const startM = time.getMinutes();
                      const start = `${pad(startH)}:${pad(startM)}`;
                      const endDate = new Date(time.getTime() + 90 * 60000);
                      const endH = endDate.getHours();
                      const endM = endDate.getMinutes();
                      const end = `${pad(endH)}:${pad(endM)}`;
                      return `${start}-${end}`;
                    })()
                  : undefined,
                content: topic.trim(),
                room: selectedRoom,
                language: selectedLanguage,
                team: teamId,
                staff: selectedStaff.map(s => ({
                  ...s,
                  teachingType: s.teachingType ?? 'L',
                })),
                status: 'compiled',
              } as any;

              addLesson(selectedCourse.id, newLesson);
              setSelectedLecture(newLesson as any);
            }

            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleSaveDraft = useCallback(() => {
    if (!selectedCourse) {
      navigation.goBack();
      return;
    }

    if (selectedLecture) {
      const updatedLecture = {
        ...selectedLecture,
        title: title.trim(),
        content: topic.trim(),
        room: selectedRoom ? selectedRoom : selectedLecture.room,
        date: date ? formatMachineDate(date) : selectedLecture.date,
        time: time
          ? (() => {
              const pad = (n: number) => String(n).padStart(2, '0');
              const startH = time.getHours();
              const startM = time.getMinutes();
              const start = `${pad(startH)}:${pad(startM)}`;
              const endDate = new Date(time.getTime() + 90 * 60000);
              const endH = endDate.getHours();
              const endM = endDate.getMinutes();
              const end = `${pad(endH)}:${pad(endM)}`;
              return `${start}-${end}`;
            })()
          : selectedLecture.time,
        language: selectedLanguage,
        team: (() => {
          if (!selectedCourse?.teams) return undefined;
          if (selectedTeam === t('common.allStudents')) return undefined;
          const teamObj = selectedCourse.teams.find(
            (tm: any) => tm.title === selectedTeam,
          );
          return teamObj ? teamObj.id : selectedLecture.team;
        })(),
        status: 'draft',
      } as any;

      const lectureExists = selectedCourse.lessons.some(
        lesson => lesson.id === selectedLecture.id,
      );

      if (lectureExists) {
        updateCourseLecture(
          selectedCourse.id,
          selectedLecture.id,
          updatedLecture,
        );
      } else {
        addLesson(selectedCourse.id, updatedLecture);
      }

      setSelectedLecture(updatedLecture as any);
    } else {
      const teamId = (() => {
        if (!selectedCourse?.teams) return undefined;
        if (selectedTeam === t('common.allStudents')) return undefined;
        const teamObj = selectedCourse.teams.find(
          (tm: any) => tm.title === selectedTeam,
        );
        return teamObj && teamObj.id;
      })();

      const nextId =
        selectedCourse.lessons && selectedCourse.lessons.length > 0
          ? Math.max(...selectedCourse.lessons.map(l => l.id)) + 1
          : 1;

      const newLesson = {
        id: nextId,
        title: title.trim(),
        date: date ? formatMachineDate(date) : undefined,
        time: time
          ? (() => {
              const pad = (n: number) => String(n).padStart(2, '0');
              const startH = time.getHours();
              const startM = time.getMinutes();
              const start = `${pad(startH)}:${pad(startM)}`;
              const endDate = new Date(time.getTime() + 90 * 60000);
              const endH = endDate.getHours();
              const endM = endDate.getMinutes();
              const end = `${pad(endH)}:${pad(endM)}`;
              return `${start}-${end}`;
            })()
          : undefined,
        content: topic.trim(),
        room: selectedRoom,
        language: selectedLanguage,
        team: teamId,
        staff: selectedStaff.map(s => ({
          ...s,
          teachingType: s.teachingType ?? 'L',
        })),
        status: 'draft',
      } as any;

      addLesson(selectedCourse.id, newLesson);
      setSelectedLecture(newLesson as any);
    }
    navigation.goBack();
  }, [
    navigation,
    t,
    selectedCourse,
    selectedLecture,
    setSelectedLecture,
    title,
    topic,
    selectedRoom,
    date,
    time,
    selectedLanguage,
    selectedTeam,
    selectedStaff,
    updateCourseLecture,
    addLesson,
  ]);

  useLayoutEffect(() => {
    const isTemporary = selectedLecture ? selectedLecture.id < 0 : false;
    const canShowSaveDraft =
      !selectedLecture || selectedLecture.status === 'draft' || isTemporary;
    navigation.setOptions({
      headerRight: () => {
        return (
          canShowSaveDraft && (
            <TextButton onPress={handleSaveDraft}>
              {t('common.saveDraft')}
            </TextButton>
          )
        );
      },
      ...(!canShowSaveDraft && { unstable_headerRightItems: () => [] }),
    });
  }, [navigation, t, handleSaveDraft, selectedLecture]);

  const openStaffProfile = (staff: Staff) => {
    const profile =
      fakeProfiles.find(item => item.id === (staff.idProfile ?? staff.id)) ??
      null;

    if (!profile) return;

    setSelectedProfile(profile);
    navigation.navigate('Contatto');
  };

  const canPublish = useMemo(() => {
    if (selectedLecture) {
      if (!selectedLecture) return true;
      const statusRequiresValidation =
        selectedLecture.status === 'to compile' ||
        selectedLecture.status === 'draft';

      if (!statusRequiresValidation) return true;

      const staffList = selectedLecture?.staff ?? [];
      return (
        isDateSelected &&
        isTimeSelected &&
        selectedLanguage &&
        selectedRoom &&
        selectedTeam &&
        title.trim() !== '' &&
        topic.trim() !== '' &&
        staffList.length > 0 &&
        staffList.every(
          (s: any) => Boolean(s.teachingType) && s.teachingType !== '',
        )
      );
    }

    return (
      isDateSelected &&
      isTimeSelected &&
      selectedLanguage &&
      selectedRoom &&
      selectedTeam &&
      title.trim() !== '' &&
      topic.trim() !== '' &&
      selectedStaff &&
      selectedStaff.length > 0 &&
      selectedStaff.every(s => Boolean(s.teachingType))
    );
  }, [
    title,
    topic,
    isDateSelected,
    isTimeSelected,
    selectedLecture,
    selectedLanguage,
    selectedRoom,
    selectedTeam,
    selectedStaff,
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Section style={styles.section}>
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cardTouchArea}
              onPress={() => setActiveField('date')}
            >
              <Card rounded style={styles.card}>
                <Row style={styles.cardContent}>
                  <Icon
                    icon={faCalendar}
                    size={fontSizes['2xl']}
                    color={
                      isDateSelected
                        ? palettes.primary[700]
                        : palettes.gray[400]
                    }
                  />
                  <Col>
                    <Text
                      style={[
                        styles.cardTitle,
                        isDateSelected && {
                          color: palettes.primary[700],
                        },
                      ]}
                    >
                      {t('other.date')}
                    </Text>
                    <Row style={{ gap: spacing[1.5] }} align="center">
                      <Text style={styles.cardSubtitle}>
                        {date ? formatDate(date) : t('common.datePlaceholder')}
                      </Text>
                      <Icon icon={faChevronDown} size={fontSizes.sm} />
                    </Row>
                  </Col>
                </Row>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cardTouchArea}
              onPress={() => setActiveField('time')}
            >
              <Card rounded style={styles.card}>
                <Row style={styles.cardContent}>
                  <Icon
                    icon={faClock}
                    size={fontSizes['2xl']}
                    color={
                      isTimeSelected
                        ? palettes.primary[700]
                        : palettes.gray[400]
                    }
                  />
                  <Col>
                    <Text
                      style={[
                        styles.cardTitle,
                        isTimeSelected && {
                          color: palettes.primary[700],
                        },
                      ]}
                    >
                      {t('common.time')}
                    </Text>
                    <Row style={{ gap: spacing[1.5] }} align="center">
                      <Text style={styles.cardSubtitle}>
                        {time
                          ? formatDateTimeAccessibility(time).time
                          : t('common.timePlaceholder')}
                      </Text>
                      <Icon icon={faChevronDown} size={fontSizes.sm} />
                    </Row>
                  </Col>
                </Row>
              </Card>
            </TouchableOpacity>
          </View>
        </Section>

        <Section style={styles.section}>
          <Card rounded padded style={styles.card}>
            <Text variant="heading" style={styles.TitleText}>
              {t('other.topic')}
            </Text>
            <TextInput
              style={styles.ContentText}
              placeholder={t('common.descriptionPlaceholder')}
              value={topic}
              onChangeText={setTopic}
            />
          </Card>
        </Section>

        <Section>
          <SectionHeader
            separator={false}
            title={t('common.staff')}
            titleStyle={styles.sectionHeader}
            trailingItem={
              <Text
                variant="link"
                onPress={() => navigation.navigate('EditLectureStaff')}
                style={styles.editText}
              >
                {t('common.edit')}
              </Text>
            }
          />
          <OverviewList indented rounded style={styles.listContainer}>
            {selectedStaff.map((staff, index) => {
              return (
                <React.Fragment key={staff.id}>
                  <StaffListItem
                    staff={staff}
                    subtitle={
                      staff.teachingType
                        ? getTeachingTypeTitle(staff.teachingType)
                        : t('other.selectTypeOfTeaching')
                    }
                    onRowPress={() => openStaffProfile(staff)}
                    trailingItem={<View />} // Empty view to remove the pencil IconButton
                  />
                  {index < (selectedStaff.length ?? 0) - 1 && (
                    <IndentedDivider />
                  )}
                </React.Fragment>
              );
            })}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader
            separator={false}
            title={t('other.otherInfo')}
            titleStyle={styles.sectionHeader}
          />
          <OverviewList indented rounded style={styles.listContainer}>
            {OTHER_INFO_FIELDS.map((field, index) => {
              const actions: MenuAction[] =
                field.id === 'language'
                  ? [
                      {
                        id: 'en',
                        title: 'English',
                      },
                      {
                        id: 'it',
                        title: 'Italiano',
                      },
                    ]
                  : (field.id === 'team' &&
                      selectedCourse?.teams && [
                        // 'none' represents no team -> All Students
                        { id: 'none', title: t('common.none') },
                        ...selectedCourse.teams.map((team: any) => ({
                          id: String(team.id),
                          title: team.title,
                        })),
                      ]) ||
                    [];

              return (
                <React.Fragment key={field.id}>
                  {field.id === 'room' ? (
                    <ListItem
                      leadingItem={
                        <Icon icon={field.icon} size={fontSizes['2xl']} />
                      }
                      title={t(field.labelKey)}
                      subtitle={selectedRoom || t('other.selectRoom')}
                      isAction
                      onPress={() =>
                        navigation.navigate('EditRoom', {
                          onConfirm: (room: string) => setSelectedRoom(room),
                        })
                      }
                    />
                  ) : (
                    <StatefulMenuView
                      title={t('common.staff')}
                      actions={actions}
                      onPressAction={({ nativeEvent: { event } }) => {
                        if (field.id === 'language') {
                          setSelectedLanguage(
                            actions.find(a => a.id === event)?.title || '',
                          );
                        } else if (field.id === 'team') {
                          setSelectedTeam(
                            event === 'none'
                              ? t('common.allStudents')
                              : actions.find(a => a.id === event)?.title || '',
                          );
                        }
                      }}
                    >
                      <ListItem
                        leadingItem={
                          <Icon icon={field.icon} size={fontSizes['2xl']} />
                        }
                        title={t(field.labelKey)}
                        subtitle={
                          field.id === 'language'
                            ? selectedLanguage || t('other.selectLanguage')
                            : selectedTeam || t('other.selectTeam')
                        }
                        trailingItem={
                          field.id === 'room' ? undefined : (
                            <DropDownIcon style={styles.chevronContainer} />
                          )
                        }
                      />
                    </StatefulMenuView>
                  )}
                  {index < OTHER_INFO_FIELDS.length - 1 && <IndentedDivider />}
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
          icon={!selectedLecture && faPaperPlane}
          title={selectedLecture ? t('common.saveAndExit') : t('other.publish')}
          action={handleSaveAndExit}
          disabled={!canPublish}
        />
      </CtaButtonContainer>

      <DatePicker
        modal
        locale={language}
        date={activeField === 'date' ? date || today : time || today}
        mode={activeField === 'date' ? 'date' : 'time'}
        open={activeField !== null}
        onConfirm={handleDateChange}
        onCancel={() => setActiveField(null)}
        title={
          activeField === 'date' ? t('other.selectDate') : t('other.selectTime')
        }
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />
    </SafeAreaView>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  palettes,
  fontFamilies,
}: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing[5],
    },
    cardsContainer: {
      flexDirection: 'row',
      gap: spacing[2],
      alignItems: 'center',
      display: 'flex',
      alignSelf: 'stretch',
    },
    cardTouchArea: {
      flex: 1,
      minWidth: 0,
    },
    card: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      marginVertical: 0,
      elevation: 0,
    },
    cardContent: {
      alignItems: 'center',
      gap: spacing[3],
    },
    cardTitle: {
      color: palettes.gray[500],
      fontSize: fontSizes.sm,
      fontFamily: fontFamilies.body,
    },
    cardSubtitle: {
      color: palettes.gray[500],
      fontSize: fontSizes.md,
      fontFamily: fontFamilies.heading,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
      marginTop: spacing[1],
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
      marginTop: spacing[1],
    },
    dateTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    section: {
      padding: spacing[5],
      paddingBottom: 0,
      paddingTop: 0,
    },
    ContentText: {
      fontSize: fontSizes.md,
      color: palettes.gray[800],
      fontFamily: 'Montserrat-Regular',
      padding: 0,
    },
    editText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: fontSizes.sm,
    },
    dateTimeText: {
      fontSize: fontSizes.sm,
    },
    sectionHeader: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
    TitleText: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
    listContainer: {
      marginTop: spacing[5],
      elevation: 0,
    },
    divider: {
      marginLeft: spacing[4],
    },
    ctaButtonContainer: {
      padding: 0,
    },
    chevronContainer: {
      marginRight: -spacing[1],
    },
    CTAbutton: {
      backgroundColor: colors.background,
    },
  });
