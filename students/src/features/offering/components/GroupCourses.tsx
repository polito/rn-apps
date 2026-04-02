import { Pressable, StyleSheet } from 'react-native';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { OfferingCourseOverview } from '@polito/student-api-client';

import { GroupCoursesExpanded } from './GroupCoursesExpanded';

interface GroupCoursesProps {
  group: { name: string; data: OfferingCourseOverview[] };
  isExpanded: boolean;
  toggleExpand: () => void;
  disabled?: boolean;
}

export const GroupCourses = ({
  disabled,
  group,
  isExpanded,
  toggleExpand,
}: GroupCoursesProps) => {
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  return (
    <Col style={styles.container}>
      <Pressable onPress={toggleExpand}>
        <Row justify="space-between" align="center">
          <Text variant="title" style={styles.title}>
            {group.name}
          </Text>
          <Icon
            icon={isExpanded ? faChevronUp : faChevronDown}
            color={colors.secondaryText}
            style={styles.icon}
          />
        </Row>
      </Pressable>
      {isExpanded && (
        <GroupCoursesExpanded courses={group.data} disabled={disabled} />
      )}
    </Col>
  );
};

const createStyles = ({
  spacing,
  fontSizes,
  fontWeights,
  colors,
  palettes,
  dark,
}: Theme) =>
  StyleSheet.create({
    icon: {
      marginRight: -spacing[1],
    },
    subHeading: {
      color: dark ? palettes.info['400'] : palettes.info['700'],
      marginBottom: spacing[2],
      marginHorizontal: spacing[4],
      textTransform: 'none',
    },
    container: {
      backgroundColor: dark ? colors.surfaceDark : palettes.gray['100'],
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
    },
    title: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.4,
      fontWeight: fontWeights.medium,
      maxWidth: '80%',
    },
  });
