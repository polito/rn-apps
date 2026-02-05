import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Popover from 'react-native-popover-view';

import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisV,
  faEnvelope,
  faFilter,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomModal,
  CtaButton,
  GlobalStyles,
  ListItem,
  OverviewList,
  Row,
  SectionHeader,
  Text,
  Theme,
  useBottomModal,
  useSafeAreaSpacing,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { AddStudentsModalContent } from './AddStudentsModalContent';
import { TeachingStackParamList } from './TeachingNavigator';

export const CourseStudentsTab = () => {
  const { selectedCourse, addGroupToCourse, setSelectedStudent } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const [searchText, setSearchText] = useState('');
  const styles = useStylesheet(createStyles);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const { palettes, spacing } = useTheme();
  const [editingGroupsMode, setEditingGroupsMode] = useState(false);
  const [isMenuVisible2, setMenuVisible2] = useState(false);
  const [isMenuVisible3, setMenuVisible3] = useState(false);
  const [filterType, setFilterType] = useState<
    'all' | 'currentYear' | 'notExamined' | 'examined'
  >('all'); // <-- nuovo stato filtro
  const { t } = useTranslation();
  const [creatingGroupMode, setCreatingGroupMode] = useState(false);
  const [newGroupStudents, setNewGroupStudents] = useState<string[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const buttonRef2 = useRef(null);
  const buttonRef3 = useRef(null);

  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  if (!selectedCourse) return null;
  const { students, groups } = selectedCourse;
  const query = searchText.toLowerCase();

  const studentPassesFilter = (student: (typeof students)[0]) => {
    if (filterType === 'all') return true;
    if (filterType === 'currentYear') return student.year === '2025'; // qui potresti mettere anno dinamico
    if (filterType === 'notExamined') return student.exam === 'no';
    if (filterType === 'examined') return student.exam === 'yes';
    return true;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query);

    return matchesSearch && studentPassesFilter(student);
  });

  const doesGroupExist = () => {
    if (!newGroupStudents.length) return false;
    return groups.some(group => {
      const groupIds = group.students.map(s => s.id).sort();
      const newIds = [...newGroupStudents].sort();
      return JSON.stringify(groupIds) === JSON.stringify(newIds);
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    if (creatingGroupMode) {
      if (filteredStudents.every(s => newGroupStudents.includes(s.id))) {
        setNewGroupStudents([]);
      } else {
        setNewGroupStudents(filteredStudents.map(s => s.id));
      }
    } else if (selectionMode) {
      if (filteredStudents.every(s => selectedIds.includes(s.id))) {
        setSelectedIds([]);
      } else {
        setSelectedIds(filteredStudents.map(s => s.id));
      }
    }
  };

  const allSelected = creatingGroupMode
    ? filteredStudents.length > 0 &&
      filteredStudents.every(s => newGroupStudents.includes(s.id))
    : selectionMode
      ? filteredStudents.length > 0 &&
        filteredStudents.every(s => selectedIds.includes(s.id))
      : false;

  return (
    <>
      <BottomModal dismissable {...bottomModal} />

      <View style={[GlobalStyles.grow, paddingHorizontal]}>
        {/* Search bar */}
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
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            ref={buttonRef3}
            onPress={() => {
              setMenuVisible3(true);
            }}
            style={styles.filterIcon}
          >
            <FontAwesomeIcon
              icon={faFilter}
              size={18}
              // Cambia colore se un filtro è attivo
              color={filterType !== 'all' ? palettes.primary[600] : '#888'}
            />
          </TouchableOpacity>

          <Popover
            isVisible={isMenuVisible3}
            from={buttonRef3.current}
            onRequestClose={() => setMenuVisible3(false)}
          >
            <TouchableOpacity
              onPress={() => {
                setFilterType('all');
                setMenuVisible3(false);
              }}
            >
              <Text style={styles.menuItem}>{t('other.noFilters')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFilterType('currentYear');
                setMenuVisible3(false);
              }}
            >
              <Text style={styles.menuItem}>{t('other.currentY')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFilterType('notExamined');
                setMenuVisible3(false);
              }}
            >
              <Text style={styles.menuItem}>{t('other.notExaminated')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFilterType('examined');
                setMenuVisible3(false);
              }}
            >
              <Text style={styles.menuItem}>{t('other.Examinated')}</Text>
            </TouchableOpacity>
          </Popover>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/*
        {!creatingGroupMode && !selectionMode && (
          <>
          
           
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <SectionHeader title="Gruppi" />
              </View>
              <View>
                <TouchableOpacity ref={buttonRef} onPress={() => setMenuVisible(true)}>
                  <FontAwesomeIcon icon={faEllipsisV} size={20} style={{ marginRight: spacing[4] }} />
                </TouchableOpacity>
                <Popover isVisible={isMenuVisible} from={buttonRef} onRequestClose={() => setMenuVisible(false)}>
                  <TouchableOpacity onPress={() => {
                    setEditingGroupsMode(true);
                    setMenuVisible(false);
                  }}>
                    <Text style={styles.menuItem}>Modifica gruppi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setCreatingGroupMode(true);
                    setNewGroupStudents([]);
                    setNewGroupTitle('');
                    setMenuVisible(false);
                  }}>
                    <Text style={styles.menuItem}>Aggiungi gruppo</Text>
                  </TouchableOpacity>
                </Popover>
              </View>
            </Row>
            <View style={{ marginBottom: spacing[2] }} />
            <View style={{ maxHeight: 4 * 65 }}>
              <ScrollView nestedScrollEnabled>
                <OverviewList indented emptyStateText="Nessun gruppo trovato">
                  {filteredGroups.map(group => (
                    <ListItem
                      key={group.id.toString()}
                      title={
                        editingGroupId === group.id.toString() ? (
                          <TextInput
                            value={newGroupTitle}
                            onChangeText={setNewGroupTitle}
                            style={{ fontSize: 16, color: '#000' }}
                            autoFocus
                          />
                        ) : (
                          group.title
                        )
                      }
                      leadingItem={
                        <FontAwesomeIcon icon={faCircle} size={20} style={{ color: colors.primary[600] }} />
                      }
                      trailingItem={
                        editingGroupId === group.id.toString() ? (
                          <Row>
                            <TouchableOpacity
                              onPress={() => {
                                const selectedStudents = selectedCourse.students.filter(s =>
                                  selectedIds.includes(s.id)
                                );
                                updateGroupInCourse(selectedCourse.id, group.id, {
                                  id: parseInt(editingGroupId),
                                  title: newGroupTitle,
                                  students: selectedStudents,
                                });
                                setEditingGroupId(null);
                                setNewGroupTitle('');
                              }}
                              style={{ marginRight: spacing[3] }}
                            >
                              <FontAwesomeIcon icon={faCheck} size={20} style={{ color: colors.primary[600] }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setEditingGroupId(null);
                                setNewGroupTitle('');
                              }}
                            >
                              <FontAwesomeIcon icon={faTimes} size={20} style={{ color: colors.primary[600] }} />
                            </TouchableOpacity>
                          </Row>
                        ) : editingGroupsMode ? (
                          <Row>
                            <TouchableOpacity
                              onPress={() => {
                                setEditingGroupId(group.id.toString());
                                setNewGroupTitle(group.title);
                              }}
                              style={{ marginRight: spacing[3] }}
                            >
                              <FontAwesomeIcon icon={faPen} size={18} style={{ color: colors.primary[600] }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeGroupFromCourse(selectedCourse.id, group.id)}>
                              <FontAwesomeIcon icon={faTrash} size={18} style={{ color: colors.primary[600] }} />
                            </TouchableOpacity>
                          </Row>
                        ) : (
                          <FontAwesomeIcon icon={faEnvelope} size={20} style={{ color: colors.primary[600] }} />
                        )
                      }
                    />
                  ))}
                </OverviewList>
              </ScrollView>
            </View>
            <View style={{ marginBottom: spacing[4] }} />
          </>
        )}

        {creatingGroupMode && (
          <>
          <Card style={{marginBottom : spacing[4]}}>
            <Text 
                              variant='heading'
                              style ={{
                                marginLeft: 15,
                                marginTop: 5,
                                color : colors.formTitle
                              }}>
                                Nome
                              </Text>
            <TextInput
              placeholder="Nome del gruppo"
              value={newGroupTitle}
              onChangeText={setNewGroupTitle}
              style={[styles.searchInput, { marginVertical: spacing[2], marginHorizontal: spacing[2] }]}
              placeholderTextColor="#888"
            />
            </Card>
          </>
        )}
         */}
          {/* Sezione Studenti */}
          <Row
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ flex: 1 }}>
              <SectionHeader title={t('other.students')} />
            </View>
            {!creatingGroupMode && (
              <View>
                <TouchableOpacity
                  ref={buttonRef2}
                  onPress={() => setMenuVisible2(true)}
                >
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    size={20}
                    style={{ marginRight: spacing[4] }}
                  />
                </TouchableOpacity>
                <Popover
                  isVisible={isMenuVisible2}
                  from={buttonRef2.current}
                  onRequestClose={() => setMenuVisible2(false)}
                >
                  <TouchableOpacity
                    onPress={() => {
                      showBottomModal(
                        <AddStudentsModalContent close={closeBottomModal} />,
                      );
                    }}
                  >
                    <Text style={styles.menuItem}>{t('other.addStudent')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectionMode(true);
                      setMenuVisible2(false);
                    }}
                  >
                    <Text style={styles.menuItem}>
                      {t('other.selectStudents')}
                    </Text>
                  </TouchableOpacity>
                </Popover>
              </View>
            )}
          </Row>
          <View style={{ marginBottom: spacing[2] }} />
          {(creatingGroupMode || selectionMode) &&
            filteredStudents.length > 0 && (
              <ListItem
                title={t('other.selectAll')}
                leadingItem={
                  <TouchableOpacity onPress={toggleSelectAll}>
                    <FontAwesomeIcon
                      icon={allSelected ? faSquareCheck : faSquare}
                      size={20}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          <OverviewList indented emptyStateText="Nessuno studente trovato">
            {filteredStudents.map(student => {
              const selected = creatingGroupMode
                ? newGroupStudents.includes(student.id)
                : selectedIds.includes(student.id);
              return (
                <ListItem
                  onPress={() => {
                    setSelectedStudent(student);
                    navigation.navigate('StudentContact');
                  }}
                  key={student.id}
                  title={`${student.name} ${student.surname}`}
                  subtitle={student.id}
                  trailingItem={
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation(); // 🔒 evita che il tocco si propaghi al ListItem
                        Alert.alert('Info', t('other.renderingToMail'));
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        size={20}
                        style={{ color: palettes.primary[600] }}
                      />
                    </TouchableOpacity>
                  }
                  leadingItem={
                    creatingGroupMode ? (
                      <TouchableOpacity
                        onPress={() => {
                          setNewGroupStudents(prev =>
                            prev.includes(student.id)
                              ? prev.filter(id => id !== student.id)
                              : [...prev, student.id],
                          );
                        }}
                      >
                        <FontAwesomeIcon
                          icon={selected ? faSquareCheck : faSquare}
                          size={20}
                        />
                      </TouchableOpacity>
                    ) : selectionMode ? (
                      <TouchableOpacity
                        onPress={() => toggleSelection(student.id)}
                      >
                        <FontAwesomeIcon
                          icon={selected ? faSquareCheck : faSquare}
                          size={20}
                        />
                      </TouchableOpacity>
                    ) : (
                      <FontAwesomeIcon
                        icon={faUser}
                        size={20}
                        style={{ color: palettes.primary[600] }}
                      />
                    )
                  }
                />
              );
            })}
          </OverviewList>
        </ScrollView>

        {creatingGroupMode && (
          <>
            {doesGroupExist() ? (
              <CtaButton
                title="Gruppo già esistente"
                disabled
                action={() => {}}
                absolute={false}
              />
            ) : (
              <CtaButton
                title="Salva gruppo"
                action={() => {
                  const selectedStudents = selectedCourse.students.filter(s =>
                    newGroupStudents.includes(s.id),
                  );
                  addGroupToCourse(selectedCourse.id, {
                    id: Math.floor(Math.random() * 1000000),
                    title: newGroupTitle,
                    students: selectedStudents,
                  });
                  setCreatingGroupMode(false);
                  setNewGroupStudents([]);
                  setNewGroupTitle('');
                }}
                variant="filled"
                absolute={false}
                style={{ marginBottom: -20 }}
              />
            )}
            <CtaButton
              title={t('common.cancel')}
              variant="outlined"
              action={() => {
                setCreatingGroupMode(false);
                setNewGroupStudents([]);
                setNewGroupTitle('');
              }}
              absolute={false}
            />
          </>
        )}

        {editingGroupsMode && (
          <CtaButton
            title="Torna indietro"
            action={() => setEditingGroupsMode(false)}
            absolute={false}
            variant="filled"
          />
        )}
        {selectionMode && (
          <>
            <CtaButton
              title={t('other.contactSelectedStudents')}
              action={() => {
                Alert.alert('Info', t('other.renderingToMail'));
              }}
              variant="filled"
              absolute={false}
              style={{ marginBottom: -20 }}
              disabled={selectedIds.length === 0}
            />
            <CtaButton
              title={t('common.cancel')}
              variant="outlined"
              action={() => {
                setSelectionMode(false);
                setSelectedIds([]);
              }}
              absolute={false}
            />
          </>
        )}
      </View>
    </>
  );
};

const createStyles = ({ palettes }: Theme) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palettes.gray[200],
      borderRadius: 6,
      borderWidth: 1,
      borderColor: palettes.gray[300],
      paddingHorizontal: 12,
      marginBottom: 19,
      marginTop: 28,
      marginHorizontal: 19,
      height: 32,
    },
    searchIcon: {
      marginRight: 6,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: palettes.gray[500],
      paddingVertical: 8,
      height: 50,
      textAlignVertical: 'center',
    },
    menuItem: {
      padding: 10,
      fontSize: 16,
    },
    filterIcon: {
      marginLeft: 6,
      padding: 1,
    },
  });
