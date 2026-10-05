import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  faEllipsisVertical,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { HighlightedText } from '@polito/lib/features/people';
import {
  BottomModal,
  Checkbox,
  CtaButton,
  GlobalStyles,
  Icon,
  ListItem,
  OverviewList,
  TextButton,
  Theme,
  TranslucentTextField,
  useBottomModal,
  useHideTabs,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuView } from '@react-native-menu/menu';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import {
  ContactMethod,
  ContactMethodOverlay,
} from '../components/ContactMethodOverlay';
import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

type Props = NativeStackScreenProps<StudentsStackParamList, 'SelectStudents'>;

export const SelectStudentsModalContent = ({ navigation, route }: Props) => {
  useHideTabs();
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const parent = navigation.getParent();
      const timer = setTimeout(() => {
        parent?.setOptions({ tabBarStyle: { display: 'none' } });
      }, 0);
      return () => clearTimeout(timer);
    }, [navigation]),
  );
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, fontSizes } = useTheme();
  const { selectedCourse } = useCourses();

  const students = useMemo(
    () => selectedCourse?.students ?? [],
    [selectedCourse?.students],
  );
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () =>
      new Set(
        route.params?.initialSelectAll
          ? students.map(student => student.id)
          : [],
      ),
  );
  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  const filteredStudents = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      student =>
        student.id.toLowerCase().includes(q) ||
        student.name.toLowerCase().includes(q) ||
        student.surname.toLowerCase().includes(q),
    );
  }, [searchText, students]);

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every(student => selectedIds.has(student.id));

  const handleToggleAll = useCallback(() => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (isAllSelected) {
        filteredStudents.forEach(student => next.delete(student.id));
      } else {
        filteredStudents.forEach(student => next.add(student.id));
      }
      return next;
    });
  }, [filteredStudents, isAllSelected]);

  const handleToggleStudent = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContactMethodContinue = (method: ContactMethod) => {
    const ids = Array.from(selectedIds);
    if (method === 'email') {
      navigation.navigate('EmailCompose', { selectedIds: ids });
      return;
    }
    if (method === 'notify') {
      navigation.navigate('NotifyCompose', { selectedIds: ids });
    }
  };

  const handleContact = () => {
    showBottomModal(
      <ContactMethodOverlay
        selectedCount={selectedIds.size}
        close={closeBottomModal}
        onContinue={handleContactMethodContinue}
      />,
    );
  };

  const actionLabel = isAllSelected
    ? t('common.deselectAll')
    : t('common.selectAll');

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    navigation.setOptions({
      headerRight: () => (
        <MenuView
          actions={[{ id: 'toggleAll', title: actionLabel }]}
          onPressAction={() => handleToggleAll()}
        >
          <View style={styles.ellipsisTrigger}>
            <Icon
              icon={faEllipsisVertical}
              color={palettes.primary[400]}
              size={fontSizes.lg}
            />
          </View>
        </MenuView>
      ),
    });
  }, [
    actionLabel,
    fontSizes.lg,
    handleToggleAll,
    navigation,
    palettes.primary,
    styles.ellipsisTrigger,
  ]);

  return (
    <>
      <BottomModal dismissable {...bottomModal} />
      <SafeAreaView style={styles.root} edges={['bottom']}>
        {Platform.OS === 'ios' ? (
          <View style={styles.header}>
            <TextButton onPress={() => navigation.goBack()}>
              {t('common.close')}
            </TextButton>
            <View style={styles.headerRight}>
              <TextButton onPress={handleToggleAll}>{actionLabel}</TextButton>
            </View>
          </View>
        ) : null}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.searchBar}>
            <TranslucentTextField
              autoCorrect={false}
              leadingIcon={faSearch}
              value={searchText}
              onChangeText={setSearchText}
              style={GlobalStyles.grow}
              containerStyle={styles.searchField}
              label={t('other.searchForStudent')}
              editable
              isClearable={searchText.length > 0}
              onClear={() => setSearchText('')}
              onClearLabel={t('contactsScreen.clearSearch')}
            />
          </View>

          <ScrollView
            style={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <OverviewList
              dividers
              indented
              emptyStateText={
                filteredStudents.length === 0
                  ? t('other.noStudentsFound')
                  : undefined
              }
              style={styles.list}
            >
              {filteredStudents.map(student => (
                <ListItem
                  key={student.id}
                  title={
                    <HighlightedText
                      text={`${student.name} ${student.surname}`}
                      highlight={searchText}
                    />
                  }
                  subtitle={student.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selectedIds.has(student.id) }}
                  onPress={() => handleToggleStudent(student.id)}
                  trailingItem={
                    <Checkbox
                      isChecked={selectedIds.has(student.id)}
                      onPress={() => handleToggleStudent(student.id)}
                      containerStyle={styles.checkboxContainer}
                      textStyle={styles.checkboxText}
                    />
                  }
                />
              ))}
            </OverviewList>
          </ScrollView>

          <View style={styles.ctaRow}>
            <CtaButton
              title={t('other.contactSelected', {
                defaultValue: 'Contact selected',
              })}
              action={handleContact}
              disabled={selectedIds.size === 0}
              absolute={false}
              containerStyle={styles.ctaButtonContainer}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    ellipsisTrigger: {
      padding: spacing[3],
      marginHorizontal: -spacing[3],
    },
    flex: {
      flex: 1,
    },
    searchBar: {
      marginTop: spacing[3],
      paddingVertical: spacing[2],
    },
    searchField: {
      marginHorizontal: spacing[5],
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: spacing[4],
    },
    list: {
      marginHorizontal: spacing[5],
    },
    checkboxContainer: {
      marginHorizontal: 0,
      marginVertical: 0,
    },
    checkboxText: {
      marginHorizontal: 0,
    },
    ctaRow: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    },
    ctaButtonContainer: {
      paddingTop: 0,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
  });
