import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCourses } from '../core/contexts/CoursesContext';
import { useNavigation } from '@react-navigation/native';
import { Section } from '../ui/components/Section';
import { useBottomBarAwareStyles } from '../core/hooks/useBottomBarAwareStyles';
import { SectionHeader } from '../ui/components/SectionHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCalendar,
  faCircleInfo,
  faClock,
  faEnvelope,
  faInbox,
  faLocationDot,
  faPlus,
  faSearch,
  faCheckSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { GlobalStyles } from '../core/components/GlobalStyles';
import { ListItem } from '../ui/components/ListItem';
import { BottomBarSpacer } from '../core/components/BottomBarSpacer';
import { IndentedDivider } from '../ui/components/IndentedDivider';
import { EmptyState } from '../ui/components/EmptyState';
import { useSafeAreaSpacing } from '../core/hooks/useSafeAreaSpacing';
import { IconButton } from '../ui/components/IconButton';
import { Text } from '../ui/components/Text';
import { OverviewList } from '../ui/components/OverviewList';
import { Icon } from '../ui/components/Icon';
import { CtaButton } from '../ui/components/CtaButton';
import { useTranslation } from 'react-i18next';
import { useBottomModal } from '../core/hooks/useBottomModal';
import { BottomModal } from '../core/components/BottomModal';
import { AddStudentsToExamModalContent } from './Teaching/AddStudentsToExamModalContent';

export const ExamScreen3 = () => {
  const { selectedExam } = useCourses();
  const navigation = useNavigation();
  const { t } = useTranslation();
 const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('Course');
    });
  
    return unsubscribe; 
  }, [navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton icon={faArrowLeft} size={22} onPress={() => navigation.navigate('Course')} />
      ),
      headerTitle: () => (
        <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft: -25 }}>
          {selectedExam?.subject}
        </Text>
      ),
    });
  }, [navigation, selectedExam]);

  

  if (!selectedExam) return null;

  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { students } = selectedExam;
const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [searchText, setSearchText] = useState('');
  const [presentStudents, setPresentStudents] = useState<{ [id: string]: boolean }>({});

  const today = new Date();
  const examDate = new Date(selectedExam.date);

  const isToday =
    selectedExam.date === t('other.today') ||
    (examDate.getFullYear() === today.getFullYear() &&
      examDate.getMonth() === today.getMonth() &&
      examDate.getDate() === today.getDate());

  const filteredStudents = students.filter((student) => {
    const query = searchText.toLowerCase();
    return (
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query)
    );
  });

 const togglePresence = (studentId: string) => {
  setPresentStudents((prev) => ({
    ...prev,
    [studentId]: !prev[studentId],
  }));

  setSelectedIds((prev) =>
    prev.includes(studentId)
      ? prev.filter((id) => id !== studentId)
      : [...prev, studentId]
  );
};

  return (
    <>
              <BottomModal dismissable {...bottomModal} />
    
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Section>
          <View style={{ marginTop: 20 }}>
            <SectionHeader title={t('other.examInfo')} />
            <OverviewList>
              <ListItem
                title={t('other.examDate')}
                subtitle={isToday ? t('other.today') : selectedExam.date}
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
                subtitle={selectedExam.modality}
                leadingItem={<Icon icon={faCircleInfo} />}
              />
            </OverviewList>

            <View style={{ marginTop: 10 }} />

            <SectionHeader title={`${t('other.numberOfBooked')}: ${selectedExam.booked}`} />

            <View style={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} size={16} color="#888" style={styles.searchIcon} />
              <TextInput
                placeholder={t('other.searchStudent')}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                placeholderTextColor="#888"
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
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item: student }) => (
                    <ListItem
                      title={student.id}
                      subtitle={`${student.name} ${student.surname}`}
                      trailingItem={
                        isToday ? (
                          <TouchableOpacity
                            onPress={() => togglePresence(student.id)}
                            style={{ marginRight: 12 }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Icon
                              icon={presentStudents[student.id] ? faCheckSquare : faSquare}
                            />
                          </TouchableOpacity>
                        ) : undefined
                      }
                      onPress={() => {}}
                    />
                  )}
                  ListFooterComponent={<BottomBarSpacer />}
                  ItemSeparatorComponent={() => <IndentedDivider />}
                  ListEmptyComponent={() =>
                    filteredStudents.length === 0 ? (
                      <EmptyState icon={faInbox} message={t('other.noStudentsFound')} />
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
                    showBottomModal(<AddStudentsToExamModalContent close={closeBottomModal} />);
             }}
             absolute={false}
             variant="outlined"
             icon={faPlus}
             style={{marginBottom: -20} }
           />
             
             <CtaButton
               title={t('other.contactSelectedStudents')}
               action={() => { Alert.alert("Info", t('other.renderingToMail')); }}
               absolute={false}
               variant="filled"
               icon={faEnvelope}
                 disabled={selectedIds.length === 0}

             />
           
        
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
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
    color: '#000',
    paddingVertical: 8,
    height: 50,
    textAlignVertical: 'center',
  },
});
