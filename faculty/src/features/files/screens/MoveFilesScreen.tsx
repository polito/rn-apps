import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInput } from 'react-native';

import {
  faCheck,
  faChevronLeft,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';
import {
  BottomModal,
  Col,
  CtaButton,
  IconButton,
  ModalContent,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { FolderNameCard } from '../components/FolderNameCard';
import { SelectableRadioRow } from '../components/SelectableRadioRow';

type MoveView = 'choose-folder' | 'create-folder';

type Directory = {
  id: number;
  name: string;
};

type Props = {
  visible?: boolean;
  directories?: Directory[];
  onClose?: () => void;
  onConfirm?: (targetDirectoryId: number) => void;
  onAddFolder?: (name: string) => number | undefined;
};

/** Modal used for move destination selection. */
export const MoveFilesModal = ({
  visible = false,
  directories = [],
  onClose = () => {},
  onConfirm = () => {},
  onAddFolder = () => undefined,
}: Props) => {
  const { t } = useTranslation();
  const { palettes, colors, dark } = useTheme();
  const styles = useStylesheet(createStyles);

  const [view, setView] = useState<MoveView>('choose-folder');
  const [selectedDirId, setSelectedDirId] = useState<number | null>(null);
  const [folderName, setFolderName] = useState('');
  const [isFolderInputFocused, setIsFolderInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const resetState = () => {
    setView('choose-folder');
    setSelectedDirId(null);
    setFolderName('');
    setIsFolderInputFocused(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleBack = () => {
    Keyboard.dismiss();
    setView('choose-folder');
    setFolderName('');
    setIsFolderInputFocused(false);
  };

  const handleConfirm = () => {
    Keyboard.dismiss();
    if (view === 'create-folder') {
      const name =
        folderName.trim() ||
        t('courseFilesTab.newFolder', { defaultValue: 'New Folder' });
      const createdDirectoryId = onAddFolder(name);
      setView('choose-folder');
      setFolderName('');
      setIsFolderInputFocused(false);
      if (typeof createdDirectoryId === 'number') {
        setSelectedDirId(createdDirectoryId);
      }
      return;
    } else if (selectedDirId !== null) {
      onConfirm(selectedDirId);
    }
    onClose();
  };

  const isConfirmEnabled =
    view === 'choose-folder' ? selectedDirId !== null : true;

  const folderIconColor =
    isFolderInputFocused || folderName.length > 0
      ? palettes.secondary[600]
      : palettes.text[500];

  return (
    <BottomModal
      visible={visible}
      onClose={handleClose}
      onModalHide={resetState}
    >
      <ModalContent
        title={t('courseFilesTab.manageFiles', {
          defaultValue: 'Manage Files',
        })}
        close={handleClose}
        closeColor={palettes.primary[500]}
        leadingItem={
          view === 'create-folder' ? (
            <IconButton
              icon={faChevronLeft}
              size={16}
              color={palettes.primary[500]}
              onPress={handleBack}
              accessibilityLabel={t('common.back', { defaultValue: 'Back' })}
              accessibilityRole="button"
              adjustSpacing="right"
            />
          ) : undefined
        }
      >
        <Col ph={3} pb={3}>
          {view === 'choose-folder' ? (
            <>
              {/* Items */}
              <Col gap={3} pv={3}>
                <Text style={styles.sectionLabel}>
                  {t('courseFilesTab.chooseFolder', {
                    defaultValue: 'Choose Folder',
                  })}
                </Text>

                {directories.map(dir => {
                  const isSelected = selectedDirId === dir.id;
                  return (
                    <SelectableRadioRow
                      key={dir.id}
                      label={dir.name}
                      labelNumberOfLines={1}
                      selected={isSelected}
                      onPress={() => setSelectedDirId(dir.id)}
                      containerStyle={[
                        styles.folderItem,
                        { backgroundColor: colors.background },
                        isSelected && {
                          borderWidth: 1,
                          borderColor: palettes.primary[500],
                        },
                      ]}
                      labelStyle={[
                        styles.folderItemName,
                        {
                          color: dark ? palettes.gray[50] : palettes.text[800],
                        },
                      ]}
                      trailingColor={palettes.primary[500]}
                    />
                  );
                })}
              </Col>

              {/* Buttons */}
              <Row gap={3} style={styles.buttons}>
                <CtaButton
                  title={t('courseFilesTab.addNewFolder', {
                    defaultValue: 'Add New Folder',
                  })}
                  action={() => setView('create-folder')}
                  variant="outlined"
                  absolute={false}
                  icon={faFolder}
                  containerStyle={styles.ctaButtonContainer}
                />
                <CtaButton
                  title={t('common.confirm', { defaultValue: 'Confirm' })}
                  action={handleConfirm}
                  icon={faCheck}
                  disabled={!isConfirmEnabled}
                  absolute={false}
                  containerStyle={styles.ctaButtonContainer}
                />
              </Row>
            </>
          ) : (
            <>
              {/* Items */}
              <Col gap={3} pv={3}>
                <Text style={styles.sectionLabel}>
                  {t('courseFilesTab.createYourFolder', {
                    defaultValue: 'Create your folder',
                  })}
                </Text>

                <FolderNameCard
                  label={t('courseFilesTab.typeFolderName', {
                    defaultValue: 'Type folder name',
                  })}
                  value={folderName}
                  inputRef={inputRef}
                  onChangeText={setFolderName}
                  onPress={() =>
                    requestAnimationFrame(() => inputRef.current?.focus())
                  }
                  onFocus={() => setIsFolderInputFocused(true)}
                  onBlur={() => setIsFolderInputFocused(false)}
                  placeholder={t('courseFilesTab.newFolder', {
                    defaultValue: 'New Folder',
                  })}
                  placeholderTextColor={
                    dark ? palettes.gray[400] : palettes.text[700]
                  }
                  selectionColor={palettes.orange[500]}
                  leadingIconColor={folderIconColor}
                  containerStyle={[
                    styles.folderNameCard,
                    { backgroundColor: colors.background },
                    isFolderInputFocused && {
                      borderWidth: 1,
                      borderColor: palettes.primary[500],
                    },
                  ]}
                  labelStyle={{ color: palettes.gray[500] }}
                  inputStyle={[
                    styles.folderNameInput,
                    { color: dark ? palettes.gray[50] : palettes.text[800] },
                  ]}
                  inputProps={{
                    returnKeyType: 'done',
                    onSubmitEditing: () => inputRef.current?.blur(),
                  }}
                />
              </Col>

              {/* Buttons */}
              <Row gap={3} style={styles.buttons}>
                <CtaButton
                  title={t('common.confirm', { defaultValue: 'Confirm' })}
                  action={handleConfirm}
                  icon={faCheck}
                  absolute={false}
                  containerStyle={styles.ctaButtonContainer}
                />
              </Row>
            </>
          )}
        </Col>
      </ModalContent>
    </BottomModal>
  );
};

const createStyles = ({
  spacing,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    sectionLabel: {
      paddingLeft: spacing[3],
    },
    folderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: shapes.lg,
      paddingVertical: spacing[3],
      paddingRight: spacing[5],
    },
    folderItemName: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
    },
    buttons: {
      paddingVertical: spacing[3],
    },
    ctaButtonContainer: {
      flex: 1,
      padding: 0,
    },
    folderNameCard: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    folderNameInput: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      padding: 0,
      includeFontPadding: false,
    },
  });
