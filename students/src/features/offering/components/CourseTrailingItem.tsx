import { useTranslation } from 'react-i18next';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Icon, Row, Text, useTheme } from '@polito/lib/ui';

interface TrailingItemProps {
  cfu: number;
}

export const CourseTrailingItem = ({ cfu }: TrailingItemProps) => {
  const { spacing, colors, palettes } = useTheme();
  const { t } = useTranslation();
  return (
    <Row pl={2}>
      <Text
        variant="prose"
        style={{
          color: palettes.text['500'],
          marginRight: spacing[3],
        }}
      >
        {cfu} {t('common.cfu')}
      </Text>
      <Icon
        icon={faChevronRight}
        color={colors.secondaryText}
        style={{ marginRight: -spacing[1] }}
      />
    </Row>
  );
};
