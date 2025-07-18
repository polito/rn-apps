import React, { useState, useMemo } from 'react';
import { faUserPlus, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '../../ui/components/Icon';
import { Text } from '../../ui/components/Text';
import { ModalContent } from '../../core/components/ModalContent';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { Col } from '../../ui/components/Col';
import { CtaButton } from '../../ui/components/CtaButton';
import { Badge } from '../../ui/components/Badge';
import { useCourses } from '../../core/contexts/CoursesContext';

type Props = {
  close: () => void;
};

const mockStaffList = [
  'Paolo Serra',
  'Angela Vitale',
  'Riccardo Pini',
  'Beatrice Leone',
  'Tommaso Riva',
  'Camilla Marchi',
];

let studentCounter = 1;

const generateStudentId = (): string => {
  const prefix = 'S32';
  const padded = studentCounter.toString().padStart(4, '0');
  studentCounter++;
  return `${prefix}${padded}`;
};

export const AddStudentsToExamModalContent = ({ close }: Props) => {
  const { t } = useTranslation();
  const { fontSizes } = useStylesheet((theme) => theme);
  const styles = useStylesheet(createStyles);
  const {addStudentsToExam, selectedExam} = useCourses();
  const [searchText, setSearchText] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const filteredStaff = useMemo(() => {
    return mockStaffList.filter(
      (name) =>
        name.toLowerCase().includes(searchText.toLowerCase()) &&
        !selectedStaff.includes(name)
    );
  }, [searchText, selectedStaff]);

  const handleAdd = (name: string) => {
    setSelectedStaff((prev) => [...prev, name]);
    setSearchText('');
  };

  const handleRemove = (name: string) => {
    setSelectedStaff((prev) => prev.filter((n) => n !== name));
  };

  return (
    <ModalContent title={t('other.addStudent')} close={close}>
      <Col pt={4} pb={8} ph={4} gap={3}>
        <Col align="center" gap={3}>
         
        </Col>

        {/* Barra di ricerca */}
        <View style={styles.searchContainer}>
          <Icon icon={faSearch} size={16} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder={t('other.lookForStudent')}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* Lista filtrata */}
        {searchText.length > 0 && (
          <FlatList
            data={filteredStaff}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleAdd(item)}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Persone selezionate */}
        <View style={styles.selectedContainer}>
          {selectedStaff.map((name) => (
            <TouchableOpacity key={name} onPress={() => handleRemove(name)}>
              <Badge
                text={name}
                icon={faTimes}
                backgroundColor="#007AFF"
                foregroundColor="#ffffff"
              />
            </TouchableOpacity>
          ))}
        </View>
      </Col>
      <CtaButton
        absolute={false}
        title={t('other.add')}
        action={() => {
          if (!selectedExam) return;

          const newStaff = selectedStaff.map((fullName) => {
  const [name, ...surnameParts] = fullName.trim().split(' ');
  const surname = surnameParts.join(' ');

  return {
    id: generateStudentId(),
    name,
    surname,
    year : '2025',
    exam : '',
    cityOfBirth : 'Torino',
    degreeCourse : 'Informatica',
    passedExams : [],
    passedExamsDate : []
  };
});

            addStudentsToExam(selectedExam.id, newStaff);
          
          close();
        }}
      />
    </ModalContent>
  );
};

const createStyles = ({ colors, dark }: Theme) =>
  StyleSheet.create({
    message: {
      color: dark ? colors.prose : colors.prose,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 12,
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
    resultItem: {
      padding: 10,
      backgroundColor: '#eee',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    selectedContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      gap: 8,
    },
    selectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#007AFF',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      margin: 4,
    },
    selectedText: {
      color: '#fff',
      marginRight: 8,
    },
  });
