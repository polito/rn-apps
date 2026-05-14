import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';

import { faInbox, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  BottomModal,
  CtaButton,
  EmptyState,
  GlobalStyles,
  IndentedDivider,
  Theme,
  useBottomBarAwareStyles,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import { AddStaffModalContent } from './AddStaffModalContent';
import { HandleAccessModalContent } from './HandleAccessModalContent';
import { StaffListItem } from './StaffListItem';
import { TeachingStackParamList } from './TeachingNavigator';

export const StaffScreen = () => {
  const { fakeProfiles, selectedCourse, setSelectedProfile } = useCourses();
  const course = selectedCourse;
  const styles = useStylesheet(createStyles);
  const { palettes, spacing } = useTheme();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const { t } = useTranslation();
  const {
    open: showBottomModal,
    modal: bottomModal,
    close: closeBottomModal,
  } = useBottomModal();

  const staffData = useMemo(() => {
    if (!course) {
      return [];
    }

    return [...(course.staff ?? [])].sort((a, b) => {
      const staffWeight = (staff: Staff) => (staff.role === 'Titolare' ? 0 : 1);
      const roleDiff = staffWeight(a) - staffWeight(b);
      if (roleDiff !== 0) return roleDiff;
      return a.name.localeCompare(b.name);
    });
  }, [course]);

  const openStaffProfile = (staff: Staff) => {
    const profile =
      fakeProfiles.find(item => item.id === (staff.idProfile ?? staff.id)) ??
      null;

    if (!profile) return;

    setSelectedProfile(profile);
    navigation.navigate('Contatto');
  };

  if (!course) {
    return null;
  }

  return (
    <>
      <BottomModal dismissable {...bottomModal} />
      <View style={styles.screen}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          initialNumToRender={15}
          style={GlobalStyles.grow}
          contentContainerStyle={[
            styles.listContainer,
            (!staffData || staffData.length === 0) && styles.emptyListContainer,
          ]}
          data={staffData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item: staff }) => (
            <StaffListItem
              staff={staff}
              navigateEnabled={false}
              onRowPress={() => openStaffProfile(staff)}
              onPress={() =>
                showBottomModal(
                  <HandleAccessModalContent
                    close={closeBottomModal}
                    staff={staff}
                  />,
                )
              }
            />
          )}
          ItemSeparatorComponent={() => <IndentedDivider />}
          ListEmptyComponent={() => {
            if (!staffData || staffData.length === 0) {
              return (
                <EmptyState
                  icon={faInbox}
                  message={t('courseStaffTab.emptyState')}
                />
              );
            }
            return null;
          }}
        />
      </View>
      <CtaButton
        title={t('other.addMember')}
        action={() =>
          showBottomModal(<AddStaffModalContent close={closeBottomModal} />, {
            avoidKeyboard: false,
          })
        }
        icon={faPlus}
        absolute={false}
        variant="filled"
        containerStyle={{
          paddingHorizontal: spacing[5],
          paddingTop: spacing[2],
          ...bottomBarAwareStyles,
        }}
        style={{
          borderRadius: 12,
          backgroundColor: palettes.primary[500],
          borderColor: palettes.primary[500],
        }}
        textStyle={{ color: palettes.gray[50] }}
      />
    </>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      marginTop: spacing[5],
    },
    listContainer: {
      marginHorizontal: spacing[5],
      borderRadius: spacing[4],
      backgroundColor: colors.surface,
      overflow: 'hidden',
      elevation: 0,
    },
    emptyListContainer: {
      minHeight: 160,
      justifyContent: 'center',
    },
  });
