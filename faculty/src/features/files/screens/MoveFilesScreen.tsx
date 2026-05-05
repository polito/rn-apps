import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronLeft,
  faCircleDot,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  CreateFolderIcon,
  CtaButton,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

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

/** Modal-like screen used for move destination selection. */
export const MoveFilesScreen = ({
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
    // Delay reset until after modal animation finishes
    setTimeout(resetState, 350);
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
    setTimeout(resetState, 350);
  };

  const isConfirmEnabled =
    view === 'choose-folder' ? selectedDirId !== null : true;

  const folderIconColor =
    isFolderInputFocused || folderName.length > 0
      ? palettes.secondary[600]
      : palettes.text[500];

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0.4}
      backdropColor="black"
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      avoidKeyboard={true}
      useNativeDriver={false}
      useNativeDriverForBackdrop
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={view === 'create-folder' ? handleBack : undefined}
            disabled={view === 'choose-folder'}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {view === 'create-folder' && (
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={16}
                color={palettes.primary[500]}
              />
            )}
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: dark ? palettes.gray[50] : palettes.primary[700] },
            ]}
          >
            {t('courseFilesTab.manageFiles', { defaultValue: 'Manage Files' })}
          </Text>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={handleClose}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              size={16}
              color={palettes.primary[500]}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {view === 'choose-folder' ? (
            <>
              {/* Items */}
              <View style={styles.items}>
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: dark ? palettes.gray[50] : palettes.gray[800] },
                  ]}
                >
                  {t('courseFilesTab.chooseFolder', {
                    defaultValue: 'Choose Folder',
                  })}
                </Text>

                {directories.map(dir => {
                  const isSelected = selectedDirId === dir.id;
                  return (
                    <TouchableOpacity
                      key={dir.id}
                      onPress={() => setSelectedDirId(dir.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      style={[
                        styles.folderItem,
                        { backgroundColor: colors.background },
                        isSelected && {
                          borderWidth: 1,
                          borderColor: palettes.primary[500],
                        },
                      ]}
                    >
                      <View style={styles.folderItemContent}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.folderItemName,
                            {
                              color: dark
                                ? palettes.gray[50]
                                : palettes.text[800],
                            },
                          ]}
                        >
                          {dir.name}
                        </Text>
                      </View>
                      <View style={styles.folderItemTrailing}>
                        <FontAwesomeIcon
                          icon={isSelected ? faCircleDot : faCircle}
                          size={16}
                          color={palettes.primary[500]}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Buttons */}
              <View style={styles.buttons}>
                <View style={styles.buttonSlot}>
                  <CtaButton
                    title={t('courseFilesTab.addNewFolder', {
                      defaultValue: 'Add New Folder',
                    })}
                    action={() => setView('create-folder')}
                    variant="outlined"
                    absolute={false}
                    leftExtra={
                      <View style={styles.addFolderIconWrap}>
                        <CreateFolderIcon
                          width={16}
                          height={16}
                          color={
                            dark ? palettes.primary[200] : palettes.primary[500]
                          }
                          filled
                        />
                      </View>
                    }
                    containerStyle={styles.ctaButtonContainer}
                    style={styles.ctaButton}
                  />
                </View>
                <View style={styles.buttonSlot}>
                  <CtaButton
                    title={t('common.confirm', { defaultValue: 'Confirm' })}
                    action={handleConfirm}
                    icon={faCheck}
                    disabled={!isConfirmEnabled}
                    absolute={false}
                    containerStyle={styles.ctaButtonContainer}
                    style={styles.ctaButton}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Items */}
              <View style={styles.items}>
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: dark ? palettes.gray[50] : palettes.gray[800] },
                  ]}
                >
                  {t('courseFilesTab.createYourFolder', {
                    defaultValue: 'Create your folder',
                  })}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    requestAnimationFrame(() => inputRef.current?.focus())
                  }
                  activeOpacity={1}
                  style={[
                    styles.folderNameCard,
                    { backgroundColor: colors.background },
                    isFolderInputFocused && {
                      borderWidth: 1,
                      borderColor: palettes.primary[500],
                    },
                  ]}
                >
                  <View style={styles.folderNameLeading}>
                    <CreateFolderIcon
                      width={20}
                      height={20}
                      color={folderIconColor}
                    />
                  </View>
                  <View style={styles.folderNameContent}>
                    <Text
                      style={[
                        styles.folderNameLabel,
                        { color: palettes.gray[500] },
                      ]}
                    >
                      {t('courseFilesTab.typeFolderName', {
                        defaultValue: 'Type folder name',
                      })}
                    </Text>
                    <TextInput
                      ref={inputRef}
                      value={folderName}
                      onChangeText={setFolderName}
                      onFocus={() => setIsFolderInputFocused(true)}
                      onBlur={() => setIsFolderInputFocused(false)}
                      placeholder={t('courseFilesTab.newFolder', {
                        defaultValue: 'New Folder',
                      })}
                      placeholderTextColor={
                        dark ? palettes.gray[400] : palettes.text[700]
                      }
                      style={[
                        styles.folderNameInput,
                        {
                          color: dark ? palettes.gray[50] : palettes.text[800],
                        },
                      ]}
                      selectionColor={palettes.orange[500]}
                      returnKeyType="done"
                      onSubmitEditing={() => inputRef.current?.blur()}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Buttons */}
              <View style={styles.buttons}>
                <View style={styles.buttonSlot}>
                  <CtaButton
                    title={t('common.confirm', { defaultValue: 'Confirm' })}
                    action={handleConfirm}
                    icon={faCheck}
                    absolute={false}
                    containerStyle={styles.ctaButtonContainer}
                    style={styles.ctaButton}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
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
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    container: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 57,
      paddingHorizontal: spacing[5],
      gap: spacing[2.5],
      overflow: 'hidden',
    },
    headerIconButton: {
      width: 20,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
      textAlign: 'center',
    },
    content: {
      paddingHorizontal: spacing[3],
      paddingBottom: spacing[3],
    },
    items: {
      gap: spacing[3],
      paddingVertical: spacing[3],
    },
    sectionLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      lineHeight: 24,
      paddingLeft: spacing[3],
    },
    folderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: shapes.lg,
      paddingVertical: spacing[3],
      paddingRight: spacing[2],
    },
    folderItemContent: {
      flex: 1,
      paddingLeft: spacing[4],
      overflow: 'hidden',
    },
    folderItemName: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
    },
    folderItemTrailing: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttons: {
      flexDirection: 'row',
      gap: 11,
      paddingVertical: spacing[3],
    },
    buttonSlot: {
      flex: 1,
    },
    ctaButtonContainer: {
      width: '100%',
      padding: 0,
    },
    ctaButton: {
      width: '100%',
    },
    addFolderIconWrap: {
      marginRight: spacing[2],
    },
    folderNameCard: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    folderNameLeading: {
      width: 46,
      height: '100%',
      paddingLeft: spacing[4],
      alignItems: 'center',
      justifyContent: 'center',
    },
    folderNameContent: {
      flex: 1,
      paddingLeft: spacing[4],
      justifyContent: 'center',
      overflow: 'hidden',
    },
    folderNameLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 21,
    },
    folderNameInput: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      padding: 0,
      includeFontPadding: false,
    },
  });
