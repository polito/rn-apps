import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  Col,
  CtaButton,
  Icon,
  ModalContent,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { useCourses } from '../../core/contexts/CoursesContext';

type Props = {
  close: () => void;
};

const mockStaffList = [
  'Giulia Rossi',
  'Marco Bianchi',
  'Elena Verdi',
  'Luca Neri',
  'Sara Gialli',
  'Davide Blu',
];

export const AddStaffModalContent = ({ close }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { addStaffToCourse, selectedCourse } = useCourses();
  const [searchText, setSearchText] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const { palettes, colors } = useTheme();
  const filteredStaff = useMemo(() => {
    return mockStaffList.filter(
      name =>
        name.toLowerCase().includes(searchText.toLowerCase()) &&
        !selectedStaff.includes(name),
    );
  }, [searchText, selectedStaff]);

  const handleAdd = (name: string) => {
    setSelectedStaff(prev => [...prev, name]);
    setSearchText('');
  };

  const handleRemove = (name: string) => {
    setSelectedStaff(prev => prev.filter(n => n !== name));
  };

  return (
    <ModalContent title={t('other.addCollaborator')} close={close}>
      <Col pt={4} pb={8} ph={4} gap={3}>
        <Col align="center" gap={3} />

        {/* Barra di ricerca */}
        <View style={styles.searchContainer}>
          <Icon
            icon={faSearch}
            size={16}
            color={palettes.gray[500]}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={t('other.lookForPeople')}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholderTextColor={palettes.gray[500]}
          />
        </View>

        {/* Lista filtrata */}
        {searchText.length > 0 && (
          <FlatList
            data={filteredStaff}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleAdd(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Persone selezionate */}
        <View style={styles.selectedContainer}>
          {selectedStaff.map(name => (
            <TouchableOpacity key={name} onPress={() => handleRemove(name)}>
              <Badge
                text={name}
                icon={faTimes}
                backgroundColor={palettes.lightBlue[500]}
                foregroundColor={colors.white}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Col>
      <CtaButton
        absolute={false}
        title={t('other.add')}
        action={() => {
          if (!selectedCourse) return;

          const newStaff = selectedStaff.map((name, index) => ({
            id: Date.now() + index, // oppure un altro modo per generare ID univoci
            name,
            role: 'Collaboratore',
            access: 'Può leggere',
          }));

          addStaffToCourse(selectedCourse.id, newStaff);
          close();
        }}
      />
    </ModalContent>
  );
};

const createStyles = ({ colors, palettes, dark }: Theme) =>
  StyleSheet.create({
    message: {
      color: dark ? colors.prose : colors.prose,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palettes.gray[200],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palettes.gray[300],
      paddingHorizontal: 12,
      height: 40,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: palettes.gray[800],
      paddingVertical: 8,
      height: 50,
      textAlignVertical: 'center',
    },
    resultItem: {
      padding: 10,
      backgroundColor: palettes.gray[200],
      borderBottomWidth: 1,
      borderBottomColor: palettes.gray[300],
    },
    selectedContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      gap: 8,
    },
  });
