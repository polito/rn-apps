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
  Col,
  CtaButton,
  CtaButtonContainer,
  Icon,
  ListItem,
  Overlay,
  Row,
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
  const { colors, palettes, fontSizes, spacing } = useTheme();

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
    <Overlay
      title={t('other.handleAccess')}
      close={close}
      footer={
        <CtaButtonContainer absolute={false} style={styles.ctaContainer}>
          <Row gap={2.5}>
            {canRemoveMember ? (
              <Col flex={1}>
                <CtaButton
                  title={t('other.deleteMember')}
                  action={handleDelete}
                  icon={faTrash}
                  variant="outlined"
                  absolute={false}
                  destructive
                  containerStyle={{ padding: 0 }}
                  style={{
                    backgroundColor: colors.white as string,
                  }}
                />
              </Col>
            ) : null}
            <Col flex={1}>
              <CtaButton
                title={t('common.save')}
                action={handleSave}
                icon={faCheck}
                absolute={false}
                containerStyle={{ padding: 0 }}
              />
            </Col>
          </Row>
        </CtaButtonContainer>
      }
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          <Text style={styles.boldText}>{staff.name}</Text>{' '}
          {t('other.willBeAbleTo')}
        </Text>

        <View style={{ gap: spacing[3] }}>
          {accessOptions.map(option => {
            const isSelected = selectedAccess === option.id;
            return (
              <ListItem
                key={option.id}
                onPress={() => setSelectedAccess(option.id)}
                title={option.label}
                subtitle={option.description}
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
      </View>
    </Overlay>
  );
};

const createStyles = ({ palettes, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    headerText: {
      fontSize: 16,
      color: palettes.gray[800],
    },
    boldText: {
      fontWeight: 'bold',
    },
    ctaContainer: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
    },
    buttonWrapper: {
      flex: 1,
    },
    listItemContainer: {
      backgroundColor: palettes.gray[100],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palettes.gray[100],
    },
    listItemContainerSelected: {
      borderColor: palettes.primary[500],
    },
  });
