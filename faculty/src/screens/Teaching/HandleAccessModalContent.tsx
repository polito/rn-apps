import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronRight,
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

import {
  STAFF_ACCESS_VALUES,
  StaffAccessValue,
  isHolderStaff,
  normalizeStaffAccess,
} from '../../core/constants/staffAccess';
import { Staff, useCourses } from '../../core/contexts/CoursesContext';

type Props = {
  close: () => void;
  staff: Staff;
  current?: number;
  total?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onAccessSaved?: (access: StaffAccessValue) => void;
};

export const HandleAccessModalContent = ({
  close,
  staff,
  current,
  total,
  onNext,
  onPrevious,
  onAccessSaved,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedCourse, updateStaffAccess, removeStaffFromCourse } =
    useCourses();
  const { colors, palettes, fontSizes, spacing } = useTheme();

  const [selectedAccess, setSelectedAccess] = useState<StaffAccessValue>(
    normalizeStaffAccess(staff.access),
  );
  const canRemoveMember = !isHolderStaff(staff);
  const isMultipleStaff = current && total && total > 1;
  const title = isMultipleStaff
    ? `${t('other.handleAccess')} ${current}/${total}`
    : t('other.handleAccess');
  const showBackButton = Boolean(current && current > 1 && onPrevious);

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

  const commitSelectedAccess = () => {
    if (selectedCourse) {
      updateStaffAccess(selectedCourse.id, staff.id, selectedAccess);
    }
    onAccessSaved?.(selectedAccess);
  };

  const confirmFullAccess = (onConfirm: () => void) => {
    Alert.alert(
      t('other.confirm'),
      t('other.confirmFullAccessAssignment', {
        name: staff.name,
      }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('other.confirm'),
          style: 'destructive',
          onPress: onConfirm,
        },
      ],
    );
  };

  const handleSave = () => {
    if (selectedAccess === STAFF_ACCESS_VALUES.full) {
      confirmFullAccess(() => {
        commitSelectedAccess();
        close();
      });
      return;
    }

    commitSelectedAccess();
    close();
  };

  const handleNext = () => {
    if (selectedAccess === STAFF_ACCESS_VALUES.full) {
      confirmFullAccess(() => {
        commitSelectedAccess();
        onNext?.();
      });
      return;
    }

    commitSelectedAccess();
    onNext?.();
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
      title={title}
      close={close}
      backButton={showBackButton}
      backButtonAction={onPrevious}
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
                title={
                  isMultipleStaff && onNext && current !== total
                    ? t('common.next')
                    : t('common.save')
                }
                action={
                  isMultipleStaff && onNext && current !== total
                    ? handleNext
                    : handleSave
                }
                icon={
                  isMultipleStaff && onNext && current !== total
                    ? faChevronRight
                    : faCheck
                }
                absolute={false}
                containerStyle={{ padding: 0 }}
              />
            </Col>
          </Row>
        </CtaButtonContainer>
      }
    >
      <View style={styles.container}>
        <Row>
          <Text style={styles.boldText}>{staff.name} </Text>
          <Text style={styles.headerText}>
            {t('courseStaffTab.willBeAbleToHave')}
          </Text>
        </Row>

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

const createStyles = ({ palettes, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    headerText: {
      fontSize: fontSizes.md,
      color: palettes.gray[800],
      fontFamily: 'Montserrat-Medium',
    },
    boldText: {
      fontSize: fontSizes.md,
      fontFamily: 'Montserrat-Bold',
    },
    ctaContainer: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
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
