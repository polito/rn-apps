import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';

import { faFile, faFolder, faInbox } from '@fortawesome/free-solid-svg-icons';

import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { CtaButton, CtaButtonSpacer } from '../../ui/components/CtaButton';
import { EmptyState } from '../../ui/components/EmptyState';
import { Icon } from '../../ui/components/Icon';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';
import { CourseFileListItem } from './CourseFileListItem';

export const CourseFilesTab = () => {
  const { palettes } = useTheme();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { selectedCourse } = useCourses();

  const [scrollEnabled] = useState(true);
  const [showFiles, setShowFiles] = useState(true); // Stato per mostrare/nascondere i file
  const { t } = useTranslation();
  const [showFilesInDirectory, setShowFilesInDirectory] = useState(false);
  const [Id, setId] = useState(0);

  // Troviamo il corso corrispondente
  const course = selectedCourse;

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }

  const { directories } = course; // Otteniamo le directory del corso
  // Funzione per ottenere tutti i file da tutte le directory
  const getAllFiles = () => {
    return directories.flatMap(directory => directory.files);
  };

  // Funzione per ottenere i file di una directory specifica
  const getFilesFromDirectory = (dirId: number) => {
    return directories.find(directory => directory.id === dirId)?.files || [];
  };

  // Se non ci sono directory, ritorniamo un messaggio vuoto
  if (directories.length === 0) {
    return <EmptyState icon={faInbox} message="No directories found" />;
  }

  return (
    <>
      {showFiles ? (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={paddingHorizontal}
          scrollEnabled={scrollEnabled}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={4}
          data={
            showFilesInDirectory ? getFilesFromDirectory(Id) : getAllFiles()
          }
          keyExtractor={item => item.id.toString()}
          renderItem={({ item: file, index }) => (
            <CourseFileListItem
              fileId={file.id}
              key={file.id}
              name={file.name}
              date={file.date}
              size={file.size}
              isDownloaded={index % 3 === 0} // Esempio di download stato
              mimeType={file.mimeType}
            />
          )}
          ListFooterComponent={
            <>
              <CtaButtonSpacer />
              <BottomBarSpacer />
            </>
          }
          ItemSeparatorComponent={() => <IndentedDivider />}
          ListEmptyComponent={() => (
            <EmptyState icon={faInbox} message="No files available" />
          )}
        />
      ) : (
        // Se non mostriamo i file, mostriamo le directory
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={paddingHorizontal}
          scrollEnabled={scrollEnabled}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={4}
          data={directories}
          keyExtractor={directory => directory.id.toString()}
          renderItem={({ item: directory }) => (
            <ListItem
              title={directory.name}
              subtitle={`${directory.files.length} files`}
              onPress={() => {
                setId(directory.id);
                setShowFilesInDirectory(true);
                setShowFiles(true);
              }} // Cambiamo stato per mostrare i file
              leadingItem={
                <Icon
                  icon={faFolder}
                  size={24}
                  color={palettes.secondary[500]}
                />
              }
            />
          )}
          ListFooterComponent={
            <>
              <CtaButtonSpacer />
              <BottomBarSpacer />
            </>
          }
          ItemSeparatorComponent={() => <IndentedDivider />}
          ListEmptyComponent={() => (
            <EmptyState icon={faInbox} message="No directories available" />
          )}
        />
      )}
      <CtaButton
        title={showFiles ? t('other.showFolders') : t('other.showFiles')}
        action={() => {
          setShowFiles(prev => !prev);
          setShowFilesInDirectory(false);
        }}
        absolute={false}
        variant="filled"
        icon={showFiles ? faFolder : faFile}
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
    fontWeight: 'bold',
  },
});
