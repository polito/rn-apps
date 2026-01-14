import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

import { faInbox, faPlus } from '@fortawesome/free-solid-svg-icons';

import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { BottomModal } from '../../core/components/BottomModal';
import { GlobalStyles } from '../../core/components/GlobalStyles';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomModal } from '../../core/hooks/useBottomModal';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { CtaButton } from '../../ui/components/CtaButton';
import { EmptyState } from '../../ui/components/EmptyState';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { PersonListItem } from '../../ui/components/PersonListItem';
import { AddStaffModalContent } from './AddStaffModalContent';

export const StaffScreen = () => {
  const { selectedCourse } = useCourses();
  // const _styles = useStylesheet(createStyles);
  // Troviamo il corso corrispondente
  const course = selectedCourse;

  const { paddingHorizontal } = useSafeAreaSpacing();

  const { t } = useTranslation();
  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }
  const { staff: staffData } = course; // Otteniamo le notifiche del corso

  return (
    <>
      <BottomModal dismissable {...bottomModal} />

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={15}
        style={GlobalStyles.grow}
        contentContainerStyle={paddingHorizontal}
        data={staffData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item: staff }) => (
          <PersonListItem
            key={`${staff.id}`}
            person={staff.name}
            subtitle={
              staff.role === 'Titolare'
                ? t('other.owner')
                : t('other.collaborator')
            }
            staff={staff}
          />
        )}
        ListFooterComponent={<BottomBarSpacer />}
        ItemSeparatorComponent={() => <IndentedDivider />}
        ListEmptyComponent={() => {
          if (!staffData || staffData.length === 0) {
            return <EmptyState icon={faInbox} message="Lectures empty" />;
          }
          return null;
        }}
      />
      <CtaButton
        title={t('other.addCollaborator')}
        action={() => {
          showBottomModal(<AddStaffModalContent close={closeBottomModal} />);
        }}
        icon={faPlus}
        absolute={false}
        variant="filled"
      />
    </>
  );
};

// const createStyles = ({ colors, palettes }: Theme) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingBottom: 20, // Distanza tra il contenuto e il fondo per il bottone
//     },
//     buttonContainer: {
//       position: 'absolute',
//       bottom: 0,
//       left: 0,
//       right: 0,
//       paddingHorizontal: 20,
//       paddingVertical: 8,
//       marginBottom: 16, // Distanza dal bordo inferiore
//     },
//     blueButtonContainer: {
//       backgroundColor: palettes.lightBlue[500],
//       marginHorizontal: 20,
//       borderRadius: 8,
//       padding: 0,
//     },
//     button: {
//       backgroundColor: palettes.lightBlue[500], // Colore del background del bottone
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: 'center',
//     },
//     buttonText: {
//       color: colors.white, // Colore del testo del bottone
//       fontSize: 16,
//     },
//   });
