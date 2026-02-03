import { useTranslation } from 'react-i18next';

import { OverviewList } from '@polito/lib';
import { Section } from '@polito/lib';
import { SectionHeader } from '@polito/lib';

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
        {types.map(type => (
          <SurveyCategoryListItem key={type.id} type={type} />
        ))}
      </OverviewList>
    </Section>
  );
};
