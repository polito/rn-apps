import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  InteractionManager,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  faFaceSmile,
  faFile,
  faFileArrowUp,
  faFilePdf,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { formatDate } from '@polito/lib/core';
import {
  CreateFolderIcon,
  CtaButton,
  IndentedDivider,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../../core/contexts/CoursesContext';
import { FileStackParamList } from '../../../core/types/navigation';
import { DashedOutline } from '../components/DashedOutline';
import { FolderNameCard } from '../components/FolderNameCard';
import { IosTopBar, IosTopBarTextAction } from '../components/IosTopBar';
import { SelectableRadioRow } from '../components/SelectableRadioRow';

export type UploadType = 'file' | 'folder';
const DEFAULT_FOLDER_NAME = 'New Folder';
const MOCKED_UPLOADED_FILES = [
  'Lecture_01_Introduction.pdf',
  'Assignment_01_Guidelines.pdf',
  'Course_Outline_2026.pdf',
  'Week_02_Notes.pdf',
  'Lab_Instructions.pdf',
];

type Props = NativeStackScreenProps<
  FileStackParamList,
  'CourseFilesUploadScreen'
>;

export const CourseFilesUploadScreen = ({ navigation, route }: Props) => {
  const { courseId } = route.params;
  const { colors, dark, fontSizes, palettes } = useTheme();
  const iosGrabberColor = dark ? palettes.gray[500] : palettes.gray[300];
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { addMaterialToCourse, addDirectoryToCourse, fakeCourses } =
    useCourses();

  const [uploadType, setUploadType] = useState<UploadType>('file');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [folderName, setFolderName] = useState(DEFAULT_FOLDER_NAME);
  const [isFolderNameFocused, setIsFolderNameFocused] = useState(false);
  const folderNameInputRef = useRef<TextInput>(null);
  const allowScreenExitRef = useRef(false);
  const isCreateFolderSelected = uploadType === 'folder';
  const normalizedFolderName = folderName.trim();
  const hasEditedFolderName = normalizedFolderName !== DEFAULT_FOLDER_NAME;
  const hasUploadedSelection =
    uploadType === 'file' && uploadedFiles.length > 0;
  const isPublishEnabled =
    hasUploadedSelection || (isCreateFolderSelected && hasEditedFolderName);
  const showBackButton = hasUploadedSelection || isCreateFolderSelected;
  const shouldMuteUploadMethodStyles =
    hasUploadedSelection || isCreateFolderSelected;

  useFocusEffect(
    useCallback(() => {
      allowScreenExitRef.current = false;
      setUploadType('file');
      setUploadedFiles([]);
      setFolderName(DEFAULT_FOLDER_NAME);
      setIsFolderNameFocused(false);
    }, []),
  );

  const resetUploadStep = useCallback(() => {
    setUploadedFiles([]);
    setUploadType('file');
    setFolderName(DEFAULT_FOLDER_NAME);
    setIsFolderNameFocused(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (allowScreenExitRef.current || !showBackButton) {
        return;
      }

      event.preventDefault();
      resetUploadStep();
    });

    return unsubscribe;
  }, [navigation, resetUploadStep, showBackButton]);

  const pickFiles = (count: number) => {
    // Mocked selection used until the native picker flow is re-enabled.
    const mockedFiles = MOCKED_UPLOADED_FILES.slice(0, count);
    if (!mockedFiles.length) return;
    setUploadedFiles(prev => [...prev, ...mockedFiles]);
  };

  const focusFolderNameInput = () => {
    requestAnimationFrame(() => {
      folderNameInputRef.current?.focus();
    });
  };

  const handlePublish = () => {
    if (!isPublishEnabled) return;

    const course = fakeCourses.find(c => c.id === courseId);
    if (!course) return;

    const title =
      uploadType === 'folder'
        ? normalizedFolderName ||
          t('courseFilesTab.newFolder', { defaultValue: 'New Folder' })
        : t('courseFilesTab.newFile', { defaultValue: 'New file' });

    if (uploadType === 'folder') {
      const lastDirectoryId = course.directories.length
        ? Math.max(...course.directories.map(dir => dir.id))
        : 0;
      addDirectoryToCourse(courseId, {
        id: lastDirectoryId + 1,
        name: title,
        files: [],
      });
      allowScreenExitRef.current = true;
      navigation.goBack();
      return;
    }

    const selectedDirectoryId = course.directories[0]?.id;
    if (!selectedDirectoryId) return;

    const allFiles = course.directories.flatMap(directory => directory.files);
    const lastFileId = allFiles.length
      ? Math.max(...allFiles.map(file => file.id))
      : 0;

    uploadedFiles.forEach((fileName, index) => {
      addMaterialToCourse(courseId, selectedDirectoryId, {
        id: lastFileId + index + 1,
        name: fileName || title,
        date: formatDate(new Date()),
        size: 100,
        mimeType: 'pdf',
        dirId: selectedDirectoryId,
      });
    });
    allowScreenExitRef.current = true;
    navigation.goBack();
  };

  const handleConfirmPublish = () => {
    if (!isPublishEnabled) return;

    InteractionManager.runAfterInteractions(() =>
      Alert.alert(
        t('common.confirm', { defaultValue: 'Confirm' }),
        uploadType === 'folder'
          ? t('courseFilesTab.confirmPublishFolder', {
              defaultValue: 'Are you sure you want to publish the folder?',
            })
          : t('courseFilesTab.confirmPublishFiles', {
              defaultValue:
                'Are you sure you want to publish the selected files?',
            }),
        [
          {
            text: t('common.no', { defaultValue: 'No' }),
            style: 'cancel',
          },
          {
            text: t('common.yes', { defaultValue: 'Yes' }),
            isPreferred: true,
            onPress: handlePublish,
          },
        ],
      ),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <IosTopBar
          backgroundColor={dark ? colors.surface : colors.white}
          grabberColor={iosGrabberColor}
          dividerColor={dark ? palettes.gray[600] : colors.divider}
          left={
            <IosTopBarTextAction
              label={
                showBackButton
                  ? t('common.back', { defaultValue: 'Back' })
                  : t('common.close', { defaultValue: 'Close' })
              }
              onPress={() => {
                if (showBackButton) {
                  resetUploadStep();
                  return;
                }
                navigation.goBack();
              }}
              color={palettes.gray[500]}
              containerStyle={styles.closeButton}
            />
          }
          right={<View style={styles.headerRight} />}
        />
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: hasUploadedSelection
                ? palettes.gray[300]
                : isCreateFolderSelected
                  ? palettes.gray[400]
                  : dark
                    ? palettes.gray[50]
                    : palettes.primary[700],
            },
          ]}
        >
          {t('courseFilesTab.chooseUploadMethod', {
            defaultValue: 'Choose how to upload',
          })}
        </Text>

        <View style={styles.listContainer}>
          <SelectableRadioRow
            label={t('courseFilesTab.addFile', { defaultValue: 'Add file' })}
            selected={uploadType === 'file'}
            onPress={() => setUploadType('file')}
            disabled={shouldMuteUploadMethodStyles}
            leading={
              <FontAwesomeIcon
                icon={faFile}
                size={20}
                color={
                  shouldMuteUploadMethodStyles
                    ? palettes.gray[300]
                    : dark
                      ? palettes.gray[50]
                      : palettes.primary[700]
                }
              />
            }
            containerStyle={[
              styles.listItem,
              {
                backgroundColor: shouldMuteUploadMethodStyles
                  ? dark
                    ? 'rgba(0, 109, 185, 0.22)'
                    : palettes.gray[50]
                  : colors.surface,
                borderColor: shouldMuteUploadMethodStyles
                  ? dark
                    ? palettes.primary[500]
                    : palettes.gray[200]
                  : palettes.primary[500],
                borderWidth: uploadType === 'file' ? 1 : 0,
              },
            ]}
            labelStyle={[
              styles.listItemLabel,
              {
                color: shouldMuteUploadMethodStyles
                  ? palettes.gray[300]
                  : dark
                    ? palettes.gray[50]
                    : palettes.text[800],
              },
            ]}
            trailingColor={
              shouldMuteUploadMethodStyles
                ? palettes.gray[300]
                : uploadType === 'file'
                  ? palettes.primary[500]
                  : palettes.gray[500]
            }
            radioSize={14}
          />

          <SelectableRadioRow
            label={t('courseFilesTab.createFolder', {
              defaultValue: 'Create folder',
            })}
            selected={uploadType === 'folder'}
            onPress={() => setUploadType('folder')}
            disabled={shouldMuteUploadMethodStyles}
            leading={<CreateFolderIcon width={20} height={20} />}
            leadingContainerStyle={
              shouldMuteUploadMethodStyles ? styles.disabledLeading : undefined
            }
            containerStyle={[
              styles.listItem,
              {
                backgroundColor: shouldMuteUploadMethodStyles
                  ? dark
                    ? 'rgba(0, 109, 185, 0.22)'
                    : palettes.gray[50]
                  : colors.surface,
                borderColor:
                  uploadType === 'folder'
                    ? shouldMuteUploadMethodStyles
                      ? dark
                        ? palettes.primary[500]
                        : palettes.gray[300]
                      : palettes.primary[500]
                    : shouldMuteUploadMethodStyles
                      ? dark
                        ? palettes.primary[500]
                        : palettes.gray[200]
                      : palettes.primary[500],
                borderWidth: uploadType === 'folder' ? 1 : 0,
              },
            ]}
            labelStyle={[
              styles.listItemLabel,
              {
                color: shouldMuteUploadMethodStyles
                  ? palettes.gray[300]
                  : isCreateFolderSelected
                    ? palettes.gray[400]
                    : dark
                      ? palettes.gray[50]
                      : palettes.text[800],
              },
            ]}
            trailingColor={
              shouldMuteUploadMethodStyles
                ? palettes.gray[300]
                : isCreateFolderSelected
                  ? palettes.primary[500]
                  : palettes.gray[500]
            }
            radioSize={14}
          />
        </View>

        {uploadType === 'file' && uploadedFiles.length > 0 ? (
          <View style={styles.uploadedFilesContainer}>
            <Text
              style={[
                styles.uploadedCountLabel,
                { color: dark ? palettes.gray[50] : palettes.primary[800] },
              ]}
            >
              ({uploadedFiles.length}{' '}
              {t('courseFilesTab.filesUploaded', {
                defaultValue: 'files uploaded',
              })}
              )
            </Text>
            <View
              style={[
                styles.uploadedFilesCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.surface,
                },
              ]}
            >
              {uploadedFiles.map((fileName, index) => (
                <View
                  key={`${fileName}-${index}`}
                  style={styles.uploadedFileRow}
                >
                  <View style={styles.uploadedFileIcon}>
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      size={20}
                      color={dark ? palettes.gray[50] : palettes.primary[800]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.uploadedFileName,
                      { color: dark ? palettes.gray[50] : palettes.text[900] },
                    ]}
                  >
                    {fileName}
                  </Text>
                  {index !== uploadedFiles.length - 1 ? (
                    <IndentedDivider style={styles.uploadedFileDivider} />
                  ) : null}
                </View>
              ))}
            </View>
            <DashedOutline color={palettes.primary[600]} radius={12}>
              <TouchableOpacity
                onPress={() => {
                  pickFiles(1);
                }}
                accessibilityRole="button"
                style={[
                  styles.addMoreZone,
                  {
                    backgroundColor: dark ? colors.surface : palettes.info[50],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.addMoreText,
                    { color: dark ? palettes.gray[50] : palettes.primary[800] },
                  ]}
                >
                  {t('courseFilesTab.addMoreFiles', {
                    defaultValue: 'Add more files',
                  })}
                </Text>
                <FontAwesomeIcon
                  icon={faFaceSmile}
                  size={fontSizes.md}
                  color={dark ? palettes.gray[50] : palettes.primary[800]}
                />
              </TouchableOpacity>
            </DashedOutline>
          </View>
        ) : isCreateFolderSelected ? (
          <FolderNameCard
            label={t('courseFilesTab.nameYourFolder', {
              defaultValue: 'Name your folder',
            })}
            value={folderName}
            inputRef={folderNameInputRef}
            onChangeText={setFolderName}
            onPress={focusFolderNameInput}
            onPressIn={focusFolderNameInput}
            onFocus={() => setIsFolderNameFocused(true)}
            onBlur={() => setIsFolderNameFocused(false)}
            placeholder={t('courseFilesTab.newFolder', {
              defaultValue: 'New Folder',
            })}
            placeholderTextColor={palettes.gray[400]}
            selectionColor={palettes.secondary[500]}
            cursorColor={palettes.secondary[500]}
            containerStyle={[
              styles.folderNameCard,
              {
                backgroundColor: colors.surface,
                borderColor: dark
                  ? colors.surface
                  : isFolderNameFocused
                    ? palettes.primary[500]
                    : palettes.gray[50],
              },
            ]}
            labelStyle={{ color: palettes.gray[500] }}
            inputStyle={[
              styles.folderNameValue,
              { color: dark ? palettes.gray[50] : palettes.text[800] },
            ]}
            inputProps={{ autoCapitalize: 'sentences', editable: true }}
          />
        ) : (
          <DashedOutline color={palettes.primary[600]} radius={6}>
            <TouchableOpacity
              onPress={() => {
                pickFiles(3);
              }}
              accessibilityRole="button"
              style={[
                styles.uploadZone,
                {
                  backgroundColor: dark ? colors.surface : palettes.info[50],
                },
              ]}
            >
              <FontAwesomeIcon
                icon={faFileArrowUp}
                size={24}
                color={dark ? palettes.gray[50] : palettes.primary[700]}
              />
              <View style={styles.uploadZoneTextContainer}>
                <Text
                  style={[
                    styles.uploadZoneTitle,
                    { color: dark ? palettes.gray[50] : palettes.primary[700] },
                  ]}
                >
                  {t('courseFilesTab.uploadYourFile', {
                    defaultValue: 'Upload your file',
                  })}
                </Text>
                <Text
                  style={[
                    styles.uploadZoneSubtitle,
                    { color: dark ? palettes.gray[50] : palettes.text[700] },
                  ]}
                >
                  {t('courseFilesTab.clickToChooseFile', {
                    defaultValue: 'Click here to choose your file',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          </DashedOutline>
        )}
      </ScrollView>

      <CtaButton
        title={t('other.publish', { defaultValue: 'Publish' })}
        action={handleConfirmPublish}
        absolute={false}
        icon={faPaperPlane}
        disabled={!isPublishEnabled}
        containerStyle={styles.ctaWrapper}
      />
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontFamilies,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerRight: {
      minWidth: 56,
    },
    closeButton: {
      minWidth: 56,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing[5],
      gap: 22,
      paddingBottom: spacing[2],
    },
    sectionTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
    },
    listContainer: {
      gap: 12,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      borderRadius: shapes.lg,
      paddingRight: spacing[2],
      overflow: 'hidden',
    },
    disabledLeading: {
      opacity: 0.45,
    },
    listItemLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
    },
    uploadZone: {
      borderRadius: 6,
      minHeight: 112,
      padding: 18,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      overflow: 'hidden',
    },
    uploadedFilesContainer: {
      gap: 12,
    },
    uploadedCountLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
    },
    uploadedFilesCard: {
      marginTop: 6,
      borderRadius: shapes.lg,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: 'hidden',
    },
    uploadedFileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 68,
      paddingHorizontal: spacing[4],
      position: 'relative',
    },
    uploadedFileDivider: {
      position: 'absolute',
      left: 16,
      right: 0,
      bottom: 0,
      height: 1,
    },
    uploadedFileIcon: {
      width: 28,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    uploadedFileName: {
      marginLeft: 10,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 22,
      flex: 1,
    },
    addMoreZone: {
      minHeight: 54,
      borderRadius: shapes.md,
      paddingHorizontal: spacing[5],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    addMoreText: {
      fontFamily: fontFamilies.body,
      fontSize: 14,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
    },
    folderNameCard: {
      height: 60,
      borderRadius: shapes.lg,
      borderWidth: 1,
      paddingRight: spacing[2],
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    folderNameValue: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
      marginTop: -2,
      paddingTop: 0,
      paddingBottom: 1,
      marginBottom: 0,
    },
    uploadZoneTextContainer: {
      alignItems: 'center',
      width: '100%',
    },
    uploadZoneTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 21,
      textAlign: 'center',
    },
    uploadZoneSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: 18,
      textAlign: 'center',
    },
    ctaWrapper: {
      padding: spacing[5],
    },
  });
