import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faCircleInfo,
  faCircleXmark,
  faMinus,
  faPencil,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {
  BottomModal,
  CtaButton,
  Icon,
  ListItem,
  ModalContent,
  Text,
  Theme,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { useCourses } from '../../core/contexts/CoursesContext';
import { AssignStaffAccessModalContent } from './AssignStaffAccessModalContent';
import {
  STAFF_ACCESS_VALUES,
  StaffAccessValue,
  getStaffIdentityKey,
} from './staffAccess';

type Props = {
  close: () => void;
};

type SelectableProfile = ReturnType<typeof useCourses>['fakeProfiles'][number];

type StaffAccessDraft = {
  profileId: number;
  access?: StaffAccessValue;
};

type SearchRow = {
  profile: SelectableProfile;
  isSelected: boolean;
};

type Mode = 'search' | 'review';

const getProfileName = (profile: Pick<SelectableProfile, 'name' | 'surname'>) =>
  `${profile.name} ${profile.surname}`.trim();

const getProfileCode = (id: number) => `D${id.toString().padStart(5, '0')}`;

export const AddStaffModalContent = ({ close }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const { addStaffToCourse, fakeProfiles, selectedCourse } = useCourses();
  const [mode, setMode] = useState<Mode>('search');
  const [searchText, setSearchText] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffAccessDraft[]>([]);
  const {
    open: openAccessModal,
    modal: accessModal,
    close: closeAccessModal,
  } = useBottomModal();

  const existingStaffKeys = useMemo(
    () => new Set((selectedCourse?.staff ?? []).map(getStaffIdentityKey)),
    [selectedCourse?.staff],
  );

  const normalizedSearch = searchText.trim().toLowerCase();

  const selectedStaffIds = useMemo(
    () => new Set(selectedStaff.map(item => `${item.profileId}`)),
    [selectedStaff],
  );

  const profilesById = useMemo(
    () => new Map(fakeProfiles.map(profile => [profile.id, profile])),
    [fakeProfiles],
  );

  const selectedProfiles = useMemo(
    () =>
      selectedStaff
        .map(item => {
          const profile = profilesById.get(item.profileId);
          if (!profile) return null;
          return { ...item, profile };
        })
        .filter(
          (item): item is StaffAccessDraft & { profile: SelectableProfile } =>
            item != null,
        ),
    [profilesById, selectedStaff],
  );

  const availableProfiles = useMemo(
    () =>
      fakeProfiles.filter(profile => !existingStaffKeys.has(`${profile.id}`)),
    [existingStaffKeys, fakeProfiles],
  );

  const availableProfilesById = useMemo(
    () => new Map(availableProfiles.map(profile => [profile.id, profile])),
    [availableProfiles],
  );

  const selectedRows = useMemo(
    () =>
      selectedStaff
        .map(item => availableProfilesById.get(item.profileId))
        .filter((profile): profile is SelectableProfile => profile != null)
        .map(profile => ({
          profile,
          isSelected: true,
        })),
    [availableProfilesById, selectedStaff],
  );

  const unselectedRows = useMemo(
    () =>
      availableProfiles
        .filter(profile => !selectedStaffIds.has(`${profile.id}`))
        .map(profile => ({
          profile,
          isSelected: false,
        })),
    [availableProfiles, selectedStaffIds],
  );

  const unselectedRowsToDisplay = useMemo(() => {
    if (normalizedSearch.length === 0) return unselectedRows;

    return unselectedRows.filter(({ profile }) => {
      const fullName = getProfileName(profile).toLowerCase();
      return (
        fullName.includes(normalizedSearch) ||
        profile.mail.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [normalizedSearch, unselectedRows]);

  const unassignedStaffCount = useMemo(
    () => selectedStaff.filter(item => !item.access).length,
    [selectedStaff],
  );

  const isConfirmDisabled =
    mode === 'search'
      ? selectedStaff.length === 0
      : selectedStaff.length === 0 || unassignedStaffCount > 0;

  const searchModalHeight = useMemo(() => {
    const maxHeight = Math.max(420, windowHeight - 28);
    const targetHeight = Math.max(520, windowHeight * 0.82);
    return Math.round(Math.min(maxHeight, targetHeight));
  }, [windowHeight]);

  const toggleSelection = (profileId: number) => {
    setSelectedStaff(prev =>
      prev.some(item => item.profileId === profileId)
        ? prev.filter(item => item.profileId !== profileId)
        : [...prev, { profileId }],
    );
  };

  const removeSelectionAt = (index: number) => {
    setSelectedStaff(prev => prev.filter((_, i) => i !== index));
  };

  const setAccessAt = (index: number, access: StaffAccessValue) => {
    setSelectedStaff(prev =>
      prev.map((item, i) => (i === index ? { ...item, access } : item)),
    );
  };

  const openRoleSelectionAt = (index: number) => {
    const selected = selectedStaff[index];
    if (!selected) return;
    const profile = profilesById.get(selected.profileId);
    if (!profile) return;
    const total = selectedStaff.length;
    const collaboratorName = getProfileName(profile);

    openAccessModal(
      <AssignStaffAccessModalContent
        close={closeAccessModal}
        collaboratorName={collaboratorName}
        current={index + 1}
        total={total}
        initialAccess={selected.access}
        onDelete={() => {
          removeSelectionAt(index);
          closeAccessModal();
        }}
        onSubmit={(access, advance) => {
          const applyAccess = () => {
            setAccessAt(index, access);
            closeAccessModal();
            if (advance && index + 1 < total) {
              setTimeout(() => openRoleSelectionAt(index + 1), 220);
            }
          };

          if (access === STAFF_ACCESS_VALUES.full) {
            Alert.alert(
              t('other.confirm'),
              t('other.confirmFullAccessAssignment', {
                name: collaboratorName,
              }),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('other.confirm'),
                  style: 'destructive',
                  onPress: applyAccess,
                },
              ],
            );
            return;
          }

          applyAccess();
        }}
      />,
    );
  };

  const submitSelectedStaff = () => {
    if (!selectedCourse || selectedProfiles.length === 0) return;

    const unresolvedAccess = selectedProfiles.some(item => !item.access);
    if (unresolvedAccess) return;

    const nextStaffId =
      selectedCourse.staff.length > 0
        ? Math.max(...selectedCourse.staff.map(staff => staff.id)) + 1
        : 1;

    const newStaff = selectedProfiles.map((item, index) => ({
      id: nextStaffId + index,
      name: getProfileName(item.profile),
      role: 'Collaboratore',
      access: item.access!,
      idProfile: item.profile.id,
    }));

    const hasFullAccess = newStaff.some(
      item => item.access === STAFF_ACCESS_VALUES.full,
    );

    const commit = () => {
      addStaffToCourse(selectedCourse.id, newStaff);
      close();
    };

    if (hasFullAccess) {
      Alert.alert(
        t('other.confirm'),
        t('other.confirmFullAccessAssignmentFinal'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('other.confirm'),
            style: 'destructive',
            onPress: commit,
          },
        ],
      );
      return;
    }

    commit();
  };

  const highlightMatch = (fullName: string) => {
    const searchQuery = searchText.trim();
    if (!searchQuery) {
      return fullName;
    }

    const nameLower = fullName.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const start = nameLower.indexOf(searchLower);
    if (start < 0) {
      return fullName;
    }

    const end = start + searchQuery.length;

    return (
      <Text
        variant="title"
        style={styles.searchTitleText}
        weight="medium"
        numberOfLines={1}
      >
        {fullName.slice(0, start)}
        <Text variant="title" style={styles.searchTitleMatchText}>
          {fullName.slice(start, end)}
        </Text>
        {fullName.slice(end)}
      </Text>
    );
  };

  const renderSearchItem = (
    item: SearchRow,
    index: number,
    totalCount: number,
  ) => (
    <View key={item.profile.id}>
      <ListItem
        onPress={() => toggleSelection(item.profile.id)}
        title={highlightMatch(getProfileName(item.profile))}
        subtitle={getProfileCode(item.profile.id)}
        leadingItem={
          <Icon icon={faCircleUser} size={24} color={palettes.primary[700]} />
        }
        trailingItem={
          <Icon
            icon={item.isSelected ? faMinus : faPlus}
            size={16}
            color={palettes.primary[600]}
            style={styles.addRemoveIcon}
          />
        }
        containerStyle={item.isSelected ? styles.selectedRow : undefined}
      />
      {index < totalCount - 1 ? <View style={styles.divider} /> : null}
    </View>
  );

  return (
    <>
      <BottomModal dismissable {...accessModal} />
      <View
        style={[
          styles.modalFrame,
          mode === 'search' && { height: searchModalHeight },
        ]}
      >
        <ModalContent
          close={close}
          fill={mode === 'search'}
          headerMode="closeOnly"
          containerStyle={styles.modalContentContainer}
          headerStyle={styles.modalContentHeader}
        >
          <View style={styles.content}>
            {mode === 'search' ? (
              <>
                <View style={styles.searchContainer}>
                  <View style={styles.searchIconContainer}>
                    <Icon
                      icon={faSearch}
                      size={16}
                      color={palettes.gray[500]}
                      style={styles.searchIcon}
                    />
                  </View>
                  <View style={styles.searchTextContainer}>
                    <TextInput
                      placeholder={t('common.search')}
                      value={searchText}
                      onChangeText={setSearchText}
                      style={styles.searchInput}
                      placeholderTextColor={palettes.gray[500]}
                      selectionColor={palettes.secondary[600]}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('common.clear')}
                    onPress={() => setSearchText('')}
                    disabled={searchText.length === 0}
                    style={styles.searchClearButtonSlot}
                    hitSlop={6}
                  >
                    {searchText.length > 0 ? (
                      <Icon
                        icon={faCircleXmark}
                        size={16}
                        color={palettes.gray[500]}
                        style={styles.searchClearIcon}
                      />
                    ) : null}
                  </Pressable>
                </View>

                {normalizedSearch.length === 0 ? (
                  <Text style={styles.sectionTitle}>
                    {t('other.basedOnPreviousCourses')}
                  </Text>
                ) : null}

                {selectedRows.length > 0 ? (
                  <View
                    style={[
                      styles.selectedCardContainer,
                      unselectedRowsToDisplay.length > 0 &&
                        styles.selectedCardContainerWithGap,
                    ]}
                  >
                    <FlatList
                      keyboardShouldPersistTaps="handled"
                      data={selectedRows}
                      keyExtractor={item => `${item.profile.id}`}
                      renderItem={({ item, index }) =>
                        renderSearchItem(item, index, selectedRows.length)
                      }
                    />
                  </View>
                ) : null}

                {unselectedRowsToDisplay.length > 0 ? (
                  <View style={styles.cardContainer}>
                    <FlatList
                      keyboardShouldPersistTaps="handled"
                      data={unselectedRowsToDisplay}
                      keyExtractor={item => `${item.profile.id}`}
                      renderItem={({ item, index }) =>
                        renderSearchItem(
                          item,
                          index,
                          unselectedRowsToDisplay.length,
                        )
                      }
                    />
                  </View>
                ) : null}

                {selectedRows.length === 0 &&
                unselectedRowsToDisplay.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text variant="secondaryText">{t('other.noPersona')}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <View style={styles.cardContainer}>
                  <FlatList
                    data={selectedProfiles}
                    keyExtractor={item => `${item.profile.id}`}
                    renderItem={({ item, index }) => (
                      <>
                        <ListItem
                          title={getProfileName(item.profile)}
                          subtitle={
                            item.access
                              ? item.access === STAFF_ACCESS_VALUES.full
                                ? t('other.fullAccess')
                                : t('other.partialAccess')
                              : t('other.noRoleSelected')
                          }
                          leadingItem={
                            <Icon
                              icon={faCircleUser}
                              size={24}
                              color={palettes.primary[700]}
                            />
                          }
                          trailingItem={
                            <Icon
                              icon={faPencil}
                              size={16}
                              color={palettes.primary[600]}
                              style={styles.editIcon}
                            />
                          }
                          onPress={() => openRoleSelectionAt(index)}
                        />
                        {index < selectedProfiles.length - 1 ? (
                          <View style={styles.divider} />
                        ) : null}
                      </>
                    )}
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Text variant="secondaryText">
                          {t('other.noPersona')}
                        </Text>
                      </View>
                    }
                  />
                </View>

                {unassignedStaffCount > 0 ? (
                  <View style={styles.warningContainer}>
                    <Icon
                      icon={faCircleInfo}
                      size={16}
                      color={palettes.warning[600]}
                      style={styles.warningInfoIcon}
                    />
                    <Text style={styles.warningText}>
                      {t('other.assignAccessToComplete')}
                    </Text>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </ModalContent>

        <CtaButton
          absolute={false}
          disabled={isConfirmDisabled}
          title={t('other.confirm')}
          icon={faCheck}
          variant="filled"
          containerStyle={styles.confirmButtonContainer}
          style={[
            styles.confirmButton,
            isConfirmDisabled
              ? styles.confirmButtonDisabled
              : styles.confirmButtonActive,
          ]}
          textStyle={styles.confirmButtonText}
          action={() => {
            if (mode === 'search') {
              setMode('review');
              return;
            }
            submitSelectedStaff();
          }}
        />
      </View>
    </>
  );
};

const createStyles = ({
  colors,
  palettes,
  spacing,
  fontSizes,
  fontFamilies,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    modalFrame: {
      backgroundColor: colors.background,
    },
    modalContentContainer: {
      backgroundColor: colors.background,
    },
    modalContentHeader: {
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: palettes.gray[200],
      borderRadius: 6,
      borderWidth: 1,
      borderColor: palettes.gray[300],
      paddingHorizontal: 6,
      paddingVertical: 4,
      gap: 6,
      height: 34,
      overflow: 'hidden',
    },
    searchIconContainer: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    searchIcon: {
      width: 16,
      flexShrink: 0,
      textAlign: 'center',
    },
    searchTextContainer: {
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      flexDirection: 'row',
    },
    searchInput: {
      flex: 1,
      fontSize: fontSizes.md,
      fontFamily: fontFamilies.body,
      color: palettes.gray[800],
      lineHeight: fontSizes.md * 1.25,
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
      margin: 0,
      textAlignVertical: Platform.OS === 'android' ? 'center' : undefined,
    },
    searchClearButtonSlot: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    searchClearIcon: {
      width: 16,
      flexShrink: 0,
      textAlign: 'center',
    },
    searchTitleText: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.sm * 1.4,
    },
    searchTitleMatchText: {
      color: palettes.warning[600],
      fontSize: fontSizes.md,
      lineHeight: fontSizes.sm * 1.4,
    },
    addRemoveIcon: {
      width: 16,
      flexShrink: 0,
      textAlign: 'center',
    },
    sectionTitle: {
      color: palettes.primary[700],
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
      fontWeight: fontWeights.semibold,
      marginTop: spacing[1],
    },
    selectedCardContainer: {
      borderRadius: 18,
      backgroundColor: palettes.gray[200],
      overflow: 'hidden',
    },
    selectedCardContainerWithGap: {
      marginBottom: spacing[3],
    },
    selectedRow: {
      backgroundColor: palettes.gray[200],
    },
    cardContainer: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      maxHeight: 390,
    },
    divider: {
      marginLeft: 76,
      height: StyleSheet.hairlineWidth,
      backgroundColor: palettes.gray[300],
    },
    emptyContainer: {
      padding: 16,
      alignItems: 'center',
    },
    warningContainer: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palettes.warning[600],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
      backgroundColor: `${palettes.warning[50]}80`,
    },
    warningText: {
      color: palettes.warning[700],
      flex: 1,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.4,
    },
    warningInfoIcon: {
      marginBottom: 22,
    },
    editIcon: {
      width: 16,
      flexShrink: 0,
      alignItems: 'center',
    },
    confirmButtonContainer: {
      paddingTop: spacing[2],
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[6],
      backgroundColor: colors.background,
    },
    confirmButton: {
      borderRadius: 18,
    },
    confirmButtonActive: {
      backgroundColor: palettes.primary[500],
      borderColor: palettes.primary[500],
    },
    confirmButtonDisabled: {
      backgroundColor: palettes.gray[500],
      borderColor: palettes.gray[500],
    },
    confirmButtonText: {
      color: colors.white,
    },
  });
