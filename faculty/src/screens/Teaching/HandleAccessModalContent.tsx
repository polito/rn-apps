import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faCircleDot as faCircleDotSolid,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Icon,
  ListItem,
  ModalContent,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { Staff, useCourses } from '../../core/contexts/CoursesContext';
import {
  STAFF_ACCESS_VALUES,
  StaffAccessValue,
  isHolderStaff,
  normalizeStaffAccess,
} from './staffAccess';

type Props = {
  close: () => void;
  staff: Staff;
};

export const HandleAccessModalContent = ({ close, staff }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedCourse, updateStaffAccess, removeStaffFromCourse } =
    useCourses();
  const { colors, palettes, fontSizes, spacing, fontWeights } = useTheme();

  const [selectedAccess, setSelectedAccess] = useState<StaffAccessValue>(
    normalizeStaffAccess(staff.access),
  );
  const canRemoveMember = !isHolderStaff(staff);

  const handleDelete = () => {
    Alert.alert(
      t('other.areYouSure'),
      t('other.deleteConfirmText', {
        name: staff.name,
      }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: () => {
            if (selectedCourse) {
              removeStaffFromCourse(selectedCourse.id, staff.id);
            }
            close();
          },
        },
      ],
    );
  };

  const handleSave = () => {
    if (selectedCourse) {
      updateStaffAccess(selectedCourse.id, staff.id, selectedAccess);
    }
    close();
  };

  const accessOptions = [
    {
      id: STAFF_ACCESS_VALUES.full,
      label: t('other.fullAccess'),
      description: t('other.fullAccessDesc'),
    },
    {
      id: STAFF_ACCESS_VALUES.partial,
      label: t('other.partialAccess'),
      description: t('other.partialAccessDesc'),
    },
  ];

  return (
    <ModalContent
      title={t('other.handleAccess')}
      close={close}
      closeIconColor={palettes.primary[500]}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          <Text style={styles.boldText}>{staff.name}</Text>{' '}
          {t('other.willBeAbleTo')}
        </Text>

        <View>
          {accessOptions.map(option => {
            const isSelected = selectedAccess === option.id;
            return (
              <ListItem
                key={option.id}
                onPress={() => setSelectedAccess(option.id)}
                title={option.label}
                subtitle={option.description}
                subtitleStyle={{
                  color: colors.secondaryText,
                  lineHeight: fontSizes.sm * 1.5,
                }}
                containerStyle={[
                  styles.listItemContainer,
                  isSelected && styles.listItemContainerSelected,
                ]}
                trailingItem={
                  <Icon
                    icon={isSelected ? faCircleDotSolid : faCircle}
                    size={fontSizes.xl}
                    color={palettes.primary[500]}
                  />
                }
              />
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          {canRemoveMember ? (
            <View style={styles.buttonWrapper}>
              <CtaButton
                title={t('other.deleteMember')}
                action={handleDelete}
                icon={faTrash}
                variant="outlined"
                absolute={false}
                destructive={true}
                containerStyle={{ padding: 0 }}
                style={{
                  paddingHorizontal: spacing[3],
                  backgroundColor: colors.white as string,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: palettes.danger[600],
                }}
                textStyle={{
                  fontSize: 14,
                  fontWeight: fontWeights.semibold,
                  color: palettes.danger[600],
                }}
              />
            </View>
          ) : null}
          <View style={styles.buttonWrapper}>
            <CtaButton
              title={t('common.save')}
              action={handleSave}
              icon={faCheck}
              variant="filled"
              absolute={false}
              containerStyle={{ padding: 0 }}
              style={{
                paddingHorizontal: 4,
                backgroundColor: palettes.primary[500],
                borderColor: palettes.primary[500],
              }}
              textStyle={{ fontWeight: fontWeights.semibold }}
            />
          </View>
        </View>
      </View>
    </ModalContent>
  );
};

const createStyles = ({ palettes }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    headerText: {
      fontSize: 16,
      color: palettes.gray[800],
      marginBottom: 16,
    },
    boldText: {
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      gap: 8,
    },
    buttonWrapper: {
      flex: 1,
    },
    listItemContainer: {
      backgroundColor: palettes.gray[100],
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: palettes.gray[100],
    },
    listItemContainerSelected: {
      borderColor: palettes.primary[500],
    },
  });
