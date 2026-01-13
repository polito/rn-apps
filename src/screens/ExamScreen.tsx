import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faCalendar,
  faCheckSquare,
  faCircleInfo,
  faClock,
  faEnvelope,
  faInbox,
  faLocationDot,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BottomBarSpacer } from '../core/components/BottomBarSpacer';
import { BottomModal } from '../core/components/BottomModal';
import { GlobalStyles } from '../core/components/GlobalStyles';
import { useCourses } from '../core/contexts/CoursesContext';
import { useBottomModal } from '../core/hooks/useBottomModal';
import { useSafeAreaSpacing } from '../core/hooks/useSafeAreaSpacing';
import { CtaButton } from '../ui/components/CtaButton';
import { EmptyState } from '../ui/components/EmptyState';
import { Icon } from '../ui/components/Icon';
import { IconButton } from '../ui/components/IconButton';
import { IndentedDivider } from '../ui/components/IndentedDivider';
import { ListItem } from '../ui/components/ListItem';
import { OverviewList } from '../ui/components/OverviewList';
import { Section } from '../ui/components/Section';
import { SectionHeader } from '../ui/components/SectionHeader';
import { Text } from '../ui/components/Text';
import { useStylesheet } from '../ui/hooks/useStylesheet';
import { useTheme } from '../ui/hooks/useTheme';
import { Theme } from '../ui/types/Theme';
import { AddStudentsToExamModalContent } from './Teaching/AddStudentsToExamModalContent';
import { TeachingStackParamList } from './Teaching/TeachingNavigator';

export const ExamScreen = () => {
  const { selectedExam, setSelectedStudent } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const { t } = useTranslation();
  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  // Stato per tracciare studenti presenti
  const [presentStudents, setPresentStudents] = useState<{
    [id: string]: boolean;
  }>({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // blocca il gesto di back
      e.preventDefault();

      // fai una navigazione manuale (senza crash)
      navigation.navigate('Roles');
    });

    return unsubscribe;
  }, [navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Roles')}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ textAlign: 'center', width: '100%', marginLeft: -25 }}
        >
          {selectedExam?.subject}
        </Text>
      ),
    });
  }, [navigation, selectedExam]);

  if (!selectedExam) return null;

  const { students } = selectedExam;

  const today = new Date();
  const isToday =
    selectedExam.date === 'Oggi' ||
    (new Date(selectedExam.date).getFullYear() === today.getFullYear() &&
      new Date(selectedExam.date).getMonth() === today.getMonth() &&
      new Date(selectedExam.date).getDate() === today.getDate());

  const filteredStudents = students.filter(student => {
    const query = searchText.toLowerCase();
    return (
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query)
    );
  });

  const togglePresence = (studentId: string) => {
    setPresentStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));

    setSelectedIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId],
    );
  };

  return (
    <>
      <BottomModal dismissable {...bottomModal} />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section>
          <View style={{ marginTop: 20 }}>
            <SectionHeader title={t('other.appealInfo')} />
            <OverviewList>
              <ListItem
                title={t('other.examDate')}
                subtitle={isToday ? 'Oggi' : selectedExam.date}
                leadingItem={<Icon icon={faCalendar} />}
              />
              <ListItem
                title={t('other.bookingDeadline')}
                subtitle={isToday ? t('other.closed') : selectedExam.endDate}
                leadingItem={<Icon icon={faClock} />}
              />
              <ListItem
                title={t('other.place')}
                subtitle={selectedExam.where}
                leadingItem={<Icon icon={faLocationDot} />}
              />
              <ListItem
                title={t('other.modality')}
                subtitle={
                  selectedExam.modality === 'Scritto'
                    ? t('other.written')
                    : t('other.oral')
                }
                leadingItem={<Icon icon={faCircleInfo} />}
              />
            </OverviewList>

            <View style={{ marginTop: 10 }} />

            <SectionHeader
              title={`${t('other.numberOfBooked')}: ${selectedExam.booked}`}
            />

            <View style={styles.searchContainer}>
              <FontAwesomeIcon
                icon={faSearch}
                size={16}
                color="#888"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder={t('other.searchForStudent')}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                placeholderTextColor={palettes.gray[500]}
              />
            </View>

            <View>
              <OverviewList>
                <FlatList
                  contentInsetAdjustmentBehavior="automatic"
                  initialNumToRender={8}
                  style={GlobalStyles.grow}
                  contentContainerStyle={paddingHorizontal}
                  data={filteredStudents}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item: student }) => (
                    <ListItem
                      title={student.id}
                      subtitle={student.name + ' ' + student.surname}
                      onPress={() => {
                        setSelectedStudent(student);
                        navigation.navigate('StudentContact');
                      }}
                      trailingItem={
                        <TouchableOpacity
                          onPress={() => togglePresence(student.id)}
                          style={{ marginRight: 12 }}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // migliora la touch area
                        >
                          <Icon
                            icon={
                              presentStudents[student.id]
                                ? faCheckSquare
                                : faSquare
                            }
                          />
                        </TouchableOpacity>
                      }
                    />
                  )}
                  ListFooterComponent={<BottomBarSpacer />}
                  ItemSeparatorComponent={() => <IndentedDivider />}
                  ListEmptyComponent={() =>
                    filteredStudents.length === 0 ? (
                      <EmptyState
                        icon={faInbox}
                        message="Nessuno studente trovato"
                      />
                    ) : null
                  }
                />
              </OverviewList>
            </View>
          </View>
        </Section>
      </ScrollView>

      <CtaButton
        title={t('other.addStudent')}
        action={() => {
          showBottomModal(
            <AddStudentsToExamModalContent close={closeBottomModal} />,
          );
        }}
        absolute={false}
        variant="outlined"
        icon={faPlus}
        style={{ marginBottom: -20 }}
      />

      <CtaButton
        title={t('other.contactSelectedStudents')}
        action={() => {
          Alert.alert('Info', t('other.renderingToMail'));
        }}
        absolute={false}
        variant="filled"
        icon={faEnvelope}
        disabled={selectedIds.length === 0}
      />
    </>
  );
};

const createStyles = ({ palettes }: Theme) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palettes.gray[200],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palettes.gray[300],
      paddingHorizontal: 12,
      marginBottom: 12,
      marginTop: 12,
      marginHorizontal: 12,
      height: 40,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: palettes.gray[500],
      paddingVertical: 8,
      height: 50,
      textAlignVertical: 'center',
    },
  });
