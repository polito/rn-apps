import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { IS_IOS, dateFormatter, formatDate } from '@polito/lib/core';
import {
  DisclosureIndicator,
  ListItem,
  Row,
  Text,
  type Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  ProvisionalGrade,
  ProvisionalGradeStateEnum,
} from '@polito/student-api-client';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetRejectionTime } from '../hooks/useGetRejectionTime';
import { ProvisionalGradeStatusBadge } from './ProvisionalGradeStatusBadge';

type Props = {
  grade: ProvisionalGrade;
  index: number;
  total: number;
};

export const ProvisionalGradeListItem = ({ grade, index, total }: Props) => {
  const { t } = useTranslation();
  const { buildCompositeListLabel } = useAccessibility();

  const styles = useStylesheet(createStyles);
  const isRejected = grade.state === ProvisionalGradeStateEnum.Rejected;
  const { fontWeights } = useTheme();

  const rejectionTime = useGetRejectionTime({
    rejectingExpiresAt: grade.rejectingExpiresAt,
    isCompact: true,
  });

  const formatHHmm = dateFormatter('HH:mm');
  const subtitle = useMemo(() => {
    switch (grade.state) {
      case ProvisionalGradeStateEnum.Confirmed:
        if (grade.canBeRejected) {
          return (
            <Row>
              <Text style={styles.rejectableSubtitle}>
                {t('transcriptGradesScreen.rejectionCountdown')}
                <Text
                  style={[
                    styles.rejectableSubtitle,
                    { fontWeight: fontWeights.bold },
                  ]}
                >
                  {rejectionTime}
                </Text>
              </Text>
            </Row>
          );
        }
        break;
      case ProvisionalGradeStateEnum.Rejected:
        return t('transcriptGradesScreen.rejectedSubtitle', {
          date: formatDate(grade.rejectedAt!),
          time: formatHHmm(grade.rejectedAt!),
        });
      default:
        return undefined;
    }
  }, [
    grade.state,
    grade.canBeRejected,
    grade.rejectedAt,
    t,
    formatHHmm,
    styles.rejectableSubtitle,
    fontWeights.bold,
    rejectionTime,
  ]);

  const stateLabel = (() => {
    switch (grade.state) {
      case ProvisionalGradeStateEnum.Confirmed:
        return grade.canBeRejected && rejectionTime
          ? `${t('transcriptGradesScreen.rejectionCountdown')} ${rejectionTime}`
          : t('transcriptGradesScreen.provisionalTitle');
      case ProvisionalGradeStateEnum.Rejected:
        return t('transcriptGradesScreen.rejectedSubtitle', {
          date: formatDate(grade.rejectedAt!),
          time: formatHHmm(grade.rejectedAt!),
        });
      default:
        return t('transcriptGradesScreen.provisionalTitle');
    }
  })();

  const accessibilityLabel = useMemo(
    () =>
      buildCompositeListLabel(
        [
          t('transcriptGradesScreen.provisionalGradeItem', {
            courseName: grade.courseName,
            state: stateLabel,
          }),
        ],
        index,
        total,
      ),
    [grade.courseName, stateLabel, index, total, t, buildCompositeListLabel],
  );

  return (
    <ListItem
      title={grade.courseName}
      subtitle={subtitle}
      subtitleStyle={
        grade.state === ProvisionalGradeStateEnum.Confirmed
          ? styles.rejectableSubtitle
          : styles.subtitle
      }
      disabled={isRejected}
      accessibilityRole={isRejected ? 'none' : 'button'}
      accessibilityState={{ disabled: isRejected }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={isRejected ? undefined : t('common.tapToNavigate')}
      linkTo={
        isRejected
          ? undefined
          : {
              screen: 'ProvisionalGrade',
              params: { id: grade.id },
            }
      }
      trailingItem={
        <Row align="center" pl={2}>
          <View {...hideFromScreenReader}>
            <ProvisionalGradeStatusBadge grade={grade} />
          </View>
          {IS_IOS && !isRejected ? <DisclosureIndicator /> : undefined}
        </Row>
      }
    />
  );
};

const createStyles = ({ colors, dark, palettes, fontSizes }: Theme) => ({
  subtitle: {
    color: colors.title,
  },
  rejectableSubtitle: {
    fontSize: fontSizes.sm,
    color: dark ? palettes.danger[300] : palettes.danger[700],
  },
});
