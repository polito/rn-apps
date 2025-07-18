import { Fragment, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { List } from '../../ui/components/List';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';
import { useCourses } from '../../core/contexts/CoursesContext';
import React from 'react';
import { GlobalStyles } from '../../core/components/GlobalStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { formatDate } from '../../utils/dates';
import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { EmptyState } from '../../ui/components/EmptyState';
import {faPlus, faInbox} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { PersonListItem } from '../../ui/components/PersonListItem';
import { Text } from '../../ui/components/Text';
import { CtaButton } from '../../ui/components/CtaButton';
import { Icon } from '../../ui/components/Icon';
import { useBottomModal } from '../../core/hooks/useBottomModal';
import { BottomModal } from '../../core/components/BottomModal';
import { AddStaffModalContent } from './AddStaffModalContent';
import { useTranslation } from 'react-i18next';

export const StaffScreen= () => {
  const { fakeCourses , setSelectedLecture} = useCourses();
  const { fontSizes, colors, spacing } = useTheme();

 const { selectedCourse } = useCourses()
  // Troviamo il corso corrispondente
  const course = selectedCourse;
  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }
  const { paddingHorizontal } = useSafeAreaSpacing();

  const { staff } = course; // Otteniamo le notifiche del corso
  const navigation = useNavigation();
  const {t}  = useTranslation();
  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();


  return (
    <>
      <BottomModal dismissable {...bottomModal} />

    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={staff}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: staff, index }) => (
        <PersonListItem
          key={`${staff.id}`}
          person={staff.name}
          subtitle={staff.role === 'Titolare' ? t('other.owner') : t('other.collaborator')}
          staff = {staff}
        />
      )}
      ListFooterComponent={<BottomBarSpacer />} 
      ItemSeparatorComponent={() => <IndentedDivider  />}
      ListEmptyComponent={() => {
        if (!staff || staff.length === 0) {
          return (
            <EmptyState
              icon={faInbox}
              message={'Lectures empty'}
            />
          );
        }
    
      }}
    />
    <CtaButton
  title={t('other.addCollaborator')}
  action={() => {
    showBottomModal(<AddStaffModalContent close={closeBottomModal} />);
  }}
  icon ={faPlus}
  absolute = {false}
  variant="filled"
/>
         </>   
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20, // Distanza tra il contenuto e il fondo per il bottone
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16, // Distanza dal bordo inferiore
  },
  blueButtonContainer: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 0,
  },
  button: {
    backgroundColor: '#007AFF', // Colore del background del bottone
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Colore del testo del bottone
    fontSize: 16,
  },
});
