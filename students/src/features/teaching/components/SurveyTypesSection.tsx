import { useTranslation } from 'react-i18next';

import { OverviewList, Section, SectionHeader } from '@polito/lib/ui';

import { SurveyCategoryListItem } from '../../surveys/components/SurveyCategoryListItem';
import { SurveyType } from '../../surveys/types/SurveyType';

type Props = {
  types: SurveyType[];
};
export const SurveyTypesSection = ({ types }: Props) => {
  const { t } = useTranslation();
  return (
    <Section>
      <SectionHeader title={t('teachingScreen.cpdTitle')} />
      <OverviewList indented>
        {types.map((type, index) => (
          <SurveyCategoryListItem
            key={type.id}
            type={type}
            index={index}
            total={types.length}
          />
        ))}
      </OverviewList>
    </Section>
  );
};
