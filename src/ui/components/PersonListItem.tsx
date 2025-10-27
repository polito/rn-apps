import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableHighlightProps, View } from 'react-native';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Person } from '@polito/api-client/models/Person';

import { BottomModal } from '../../core/components/BottomModal';
import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import { useBottomModal } from '../../core/hooks/useBottomModal';
import { ModifyStaffAccessModalContent } from '../../screens/Teaching/ModifyStaffAccessModalContent';
import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';
import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';

interface Props {
  person: Person | string | undefined;
  subtitle?: string | JSX.Element;
  navigateEnabled?: boolean;
  staff?: Staff;
}

// Funzione per verificare se `person` è un oggetto `Person`
const isPerson = (p: any): p is Person =>
  typeof p === 'object' && p !== null && 'firstName' in p && 'lastName' in p;

export const PersonListItem = ({
  person,
  subtitle,
  staff,
}: TouchableHighlightProps & Props) => {
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const {
    selectedStaff,
    setSelectedStaff,
    updateStaffAccess,
    selectedCourse,
    removeStaffFromCourse,
  } = useCourses();
  const accessTranslationMap = {
    // TODO: find a better way to manage translations here
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Può leggere': t('other.canRead'),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Può eliminare': t('other.canDelete'),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Può modificare': t('other.canEdit'),
  };

  const [accessLevel, setAccessLevel] = useState(staff?.access);
  const [firstTime, setFirstTime] = useState(true);

  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
    } else {
      if (accessLevel) {
        showBottomModal(
          <ModifyStaffAccessModalContent
            close={closeBottomModal}
            accessLevel={accessLevel}
            setAccessLevel={setAccessLevel}
            selectedStaff={selectedStaff}
            selectedCourse={selectedCourse}
            updateStaffAccess={updateStaffAccess}
            removeStaffFromCourse={removeStaffFromCourse}
          />,
        );
      } else {
        closeBottomModal();
      }
    }
  }, [
    accessLevel,
    firstTime,
    closeBottomModal,
    selectedCourse,
    selectedStaff,
    showBottomModal,
    updateStaffAccess,
    removeStaffFromCourse,
  ]);
  // Se person è un `Person`, restituisce il `ListItem` con i suoi dati
  if (!staff || !selectedCourse) return null;
  if (isPerson(person)) {
    return (
      <ListItem
        leadingItem={
          person.picture ? (
            <Image source={{ uri: person.picture }} style={styles.picture} />
          ) : (
            <Icon icon={faUser} size={fontSizes['2xl']} />
          )
        }
        title={`${person.firstName} ${person.lastName}`}
        accessibilityLabel={`${subtitle}: ${person.firstName} ${person.lastName}`}
        subtitle={subtitle}
      />
    );
  }

  // Se `person` è una stringa o `undefined`, restituisce un `ListItem` alternativo
  return (
    <>
      <BottomModal dismissable {...bottomModal} />

      <ListItem
        leadingItem={<Icon icon={faUser} size={fontSizes['2xl']} />}
        title={typeof person === 'string' ? person : 'Sconosciuto'}
        subtitle={`${subtitle} - ${
          accessTranslationMap[
            staff?.access as keyof typeof accessTranslationMap
          ] || staff?.access
        }`}
        trailingItem={
          subtitle === 'Collaboratore' || subtitle === 'Collaborator' ? (
            <FontAwesomeIcon icon={faGear} size={20} />
          ) : (
            <View />
          )
        }
        onPress={() => {
          if (subtitle !== 'Titolare' && subtitle !== 'owner' && accessLevel) {
            setSelectedStaff(staff);
            showBottomModal(
              <ModifyStaffAccessModalContent
                close={closeBottomModal}
                accessLevel={accessLevel}
                setAccessLevel={setAccessLevel}
                selectedStaff={selectedStaff}
                selectedCourse={selectedCourse}
                updateStaffAccess={updateStaffAccess}
                removeStaffFromCourse={removeStaffFromCourse}
              />,
            );
          }
        }}
      />
    </>
  );
};

const createStyles = ({ colors, palettes }: Theme) =>
  StyleSheet.create({
    picture: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    overlay: {
      flex: 1,
      backgroundColor: undefined, // Sfondo semitrasparente
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuContainer: {
      backgroundColor: colors.white,
      padding: 10,
      borderRadius: 5,
      width: 320,
      minHeight: 180,
      elevation: 5,
    },
    menuItem: {
      padding: 10,
      fontSize: 16,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    radioDot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: palettes.lightBlue[500],
    },
    removeButton: {
      backgroundColor: palettes.red[500],
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },

    removeButtonText: {
      color: colors.white,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
