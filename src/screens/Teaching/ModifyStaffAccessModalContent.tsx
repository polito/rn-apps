import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ModalContent } from '../../core/components/ModalContent';
import { Staff } from '../../core/contexts/CoursesContext';
import { CtaButton } from '../../ui/components/CtaButton';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';

type Props = {
  close: () => void;
  accessLevel: string;
  setAccessLevel: (level: string) => void;
  selectedStaff: Staff | null;
  selectedCourse: any;
  updateStaffAccess: (courseId: number, staffId: number, level: string) => void;
  removeStaffFromCourse: (courseId: number, staffId: number) => void;
};

export const ModifyStaffAccessModalContent = ({
  close,
  accessLevel,
  setAccessLevel,
  selectedStaff,
  selectedCourse,
  updateStaffAccess,
  removeStaffFromCourse,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  const handleConfirmUpdate = () => {
    if (selectedStaff && selectedCourse) {
      Alert.alert(
        t('other.confirm'),
        `${t('other.alertStaffAccess')} "${accessLevel}"?`,
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('other.confirm'),
            onPress: () => {
              updateStaffAccess(
                selectedCourse.id,
                selectedStaff.id,
                accessLevel,
              );
              close();
            },
          },
        ],
      );
    }
  };

  return (
    <ModalContent title={t('other.courseAccess')} close={close}>
      <View style={styles.content}>
        {[t('other.canDelete'), t('other.canEdit'), t('other.canRead')].map(
          level => (
            <TouchableOpacity
              key={level}
              onPress={() => setAccessLevel(level)}
              style={styles.radioOption}
            >
              <View style={styles.radioCircle}>
                {accessLevel === level && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.menuItemText}>{level}</Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      <View style={styles.buttonRow}>
        <CtaButton
          destructive={true}
          absolute={false}
          title={t('other.removeCollaborator')}
          action={() => {
            if (selectedStaff && selectedCourse) {
              Alert.alert(
                t('other.confirm'),
                `${t('other.alertStaffAccess2')} ${selectedStaff.name || t('other.alertStaffAccess4')} ${t('other.alertStaffAccess3')}`,
                [
                  {
                    text: t('common.cancel'),
                    style: 'cancel',
                  },
                  {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: () => {
                      removeStaffFromCourse(
                        selectedCourse.id,
                        selectedStaff.id,
                      );
                    },
                  },
                ],
              );
            }
          }}
        />

        <CtaButton
          absolute={false}
          title={t('other.confirm')}
          action={handleConfirmUpdate}
        />
      </View>
    </ModalContent>
  );
};

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 16,
      paddingBottom: 32,
      paddingTop: 32,
      gap: 16,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary[700],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    radioDot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: colors.primary[500],
    },
    menuItemText: {
      fontSize: 16,
    },
    menuItemText2: {
      fontSize: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
  });
