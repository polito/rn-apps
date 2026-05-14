import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import {
  faMagnifyingGlass,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  BottomModal,
  CtaButton,
  CtaButtonContainer,
  CtaButtonSpacer,
  Icon,
  IndentedDivider,
  ListItem,
  ModalContent,
  OverviewList,
  Text,
  Theme,
  TranslucentTextField,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { personToStaff, useCourses } from '../../core/contexts/CoursesContext';
import { DefineAccessModal } from './DefineAccessModal';
import { StaffAccessValue, getStaffIdentityKey } from './staffAccess';

type Props = {
  close: () => void;
};

type SelectableProfile = ReturnType<typeof useCourses>['fakeProfiles'][number];

type StaffAccessDraft = {
  profileId: number;
  access?: StaffAccessValue;
};

type Mode = 'search' | 'review';

const getProfileName = (profile: Pick<SelectableProfile, 'name' | 'surname'>) =>
  `${profile.name} ${profile.surname}`.trim();

const getProfileCode = (id: number) => `D${id.toString().padStart(5, '0')}`;

export const AddStaffModalContent = ({ close }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, fontSizes } = useTheme();
  const { fakeProfiles, selectedCourse } = useCourses();
  const [mode] = useState<Mode>('search');
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

  const toggleSelection = (profileId: number) => {
    setSelectedStaff(prev =>
      prev.some(item => item.profileId === profileId)
        ? prev.filter(item => item.profileId !== profileId)
        : [...prev, { profileId }],
    );
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

  return (
    <ModalContent
      close={close}
      title={t('other.addCourseStaff')}
      footer={
        selectedRows.length > 0 && (
          <CtaButtonContainer modal absolute>
            <CtaButton
              disabled={isConfirmDisabled}
              title={t('other.continue')}
              style={
                isConfirmDisabled
                  ? styles.confirmButtonDisabled
                  : styles.confirmButtonActive
              }
              textStyle={styles.confirmButtonText}
              action={() => {
                openAccessModal(
                  <DefineAccessModal
                    addeddStaff={selectedProfiles.map(({ profile, access }) =>
                      personToStaff(profile, undefined, access ?? ''),
                    )}
                    close={close}
                    onBack={closeAccessModal}
                  />,
                );
              }}
            />
          </CtaButtonContainer>
        )
      }
    >
      <View style={styles.content}>
        <BottomModal dismissable {...accessModal} />
        {/* {mode === 'search' ? ( */}
        <React.Fragment>
          <TranslucentTextField
            type="text"
            label={t('common.search')}
            leadingIcon={faMagnifyingGlass}
            containerStyle={styles.searchContainer}
            isClearable={searchText ? true : false}
            value={searchText}
            onChangeText={setSearchText}
            onClear={() => setSearchText('')}
          />

          {normalizedSearch.length === 0 && selectedRows.length === 0 && (
            <Text style={styles.sectionTitle}>
              {t('other.basedOnPreviousCourses')}
            </Text>
          )}

          {selectedRows.length > 0 && (
            <OverviewList indented style={styles.listContainer}>
              {selectedRows.map((item, index) => {
                return (
                  <React.Fragment key={item.profile.id}>
                    <ListItem
                      title={highlightMatch(getProfileName(item.profile))}
                      subtitle={searchText && getProfileCode(item.profile.id)}
                      onPress={() => toggleSelection(item.profile.id)}
                      titleStyle={{
                        color: palettes.text[800],
                      }}
                      subtitleStyle={{
                        color: palettes.gray[600],
                      }}
                      containerStyle={styles.selectedRow}
                      leadingItem={
                        <Icon
                          icon={faCircleUser}
                          size={24}
                          color={palettes.primary[700]}
                        />
                      }
                      trailingItem={
                        <Icon
                          icon={faMinus}
                          size={fontSizes.md}
                          color={palettes.primary[600]}
                        />
                      }
                    />
                    {index < selectedRows.length - 1 && <IndentedDivider />}
                  </React.Fragment>
                );
              })}
            </OverviewList>
          )}

          {unselectedRowsToDisplay.length > 0 && (
            <OverviewList indented style={styles.listContainer}>
              {unselectedRowsToDisplay.map((item, index) => {
                return (
                  <React.Fragment key={item.profile.id}>
                    <ListItem
                      title={highlightMatch(getProfileName(item.profile))}
                      subtitle={searchText && getProfileCode(item.profile.id)}
                      onPress={() => toggleSelection(item.profile.id)}
                      titleStyle={{
                        color: palettes.text[800],
                      }}
                      subtitleStyle={{
                        color: palettes.gray[600],
                      }}
                      leadingItem={
                        <Icon
                          icon={faCircleUser}
                          size={24}
                          color={palettes.primary[700]}
                        />
                      }
                      trailingItem={
                        <Icon
                          icon={faPlus}
                          size={fontSizes.md}
                          color={palettes.primary[600]}
                        />
                      }
                    />
                    {index < unselectedRowsToDisplay.length - 1 && (
                      <IndentedDivider />
                    )}
                  </React.Fragment>
                );
              })}
            </OverviewList>
          )}

          {selectedRows.length === 0 && unselectedRowsToDisplay.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="secondaryText">{t('other.noPersona')}</Text>
            </View>
          ) : null}
        </React.Fragment>
        <CtaButtonSpacer />
      </View>
    </ModalContent>
  );
};

const createStyles = ({
  colors,
  palettes,
  spacing,
  fontSizes,
  fontWeights,
  shapes,
}: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[5],
      // flex: 1,
      height: 700,

      backgroundColor: colors.background,
    },
    searchContainer: {
      borderWidth: 1,
      borderColor: palettes.gray[300],
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

    sectionTitle: {
      color: palettes.primary[700],
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
      marginTop: spacing[5],
    },
    selectedCardContainer: {
      borderRadius: 18,
      backgroundColor: palettes.gray[200],
      overflow: 'hidden',
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
    listContainer: {
      borderRadius: shapes.lg,
      elevation: 0,
      marginTop: spacing[5],
      marginBottom: 0,
    },
  });
