import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import {
  ScreenTitle,
  Section,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

interface Props {
  name?: string;
  shortcode?: string;
  cfu?: number | null;
  parentCourseName?: string | null;
}

export const CourseHeading = ({
  name,
  shortcode,
  cfu,
  parentCourseName,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  return (
    <Section style={styles.heading}>
      <ScreenTitle title={name} />
      <Text variant="caption">
        {shortcode ?? ' '}
        {parentCourseName && ` - ${parentCourseName}`}
        {!parentCourseName && cfu && (
          <Text variant="caption">
            {' - '}
            {cfu} {t('common.cfu').toLowerCase()}
          </Text>
        )}
      </Text>
    </Section>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5],
      paddingHorizontal: spacing[4],
    },
  });
